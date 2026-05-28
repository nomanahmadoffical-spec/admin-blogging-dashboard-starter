import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json({ error: true, message: 'Missing env vars' }, { status: 500 });
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

    const body = await request.arrayBuffer();
    const buffer = Buffer.from(body);

    const contentType = request.headers.get('content-type') || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return NextResponse.json({ error: true, message: 'No boundary' }, { status: 400 });
    }

    const rawBoundary = boundaryMatch[1];
    const inBodyBoundary = '\r\n--' + rawBoundary;
    const endBoundaryStr = inBodyBoundary + '--';

    const boundaryStarts: number[] = [];
    let searchFrom = 0;
    while (true) {
      const idx = buffer.indexOf(inBodyBoundary, searchFrom);
      if (idx === -1) break;
      boundaryStarts.push(idx);
      searchFrom = idx + 1;
    }

    let pathValue: string | null = null;
    let fileData: Buffer | null = null;
    let fileName = '';
    let fileContentType = 'application/octet-stream';

    for (let i = 0; i < boundaryStarts.length; i++) {
      const bStart = boundaryStarts[i];
      const headerStart = bStart + inBodyBoundary.length;
      const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), headerStart);
      if (headerEnd === -1) continue;

      const bodyStart = headerEnd + 4;
      const nextBBoundaryIdx = i + 1 < boundaryStarts.length ? boundaryStarts[i + 1] : -1;
      const bodyEnd =
        nextBBoundaryIdx === -1 ? buffer.indexOf(endBoundaryStr, bodyStart) : nextBBoundaryIdx - 4;

      if (bodyEnd === -1 || bodyEnd <= bodyStart) continue;

      const headers = buffer.subarray(headerStart, headerEnd).toString();

      const nameMatch = headers.match(/name="([^"]+)"/);
      const fieldName = nameMatch?.[1];

      if (fieldName === 'source' && !fileData) {
        const value = buffer.subarray(bodyStart, bodyEnd).toString().trim();
        if (value) pathValue = value;
      } else if (fieldName?.startsWith('files[') && !fileData) {
        const fnMatch = headers.match(/filename="([^"]+)"/);
        const ctMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
        if (fnMatch) {
          fileName = fnMatch[1];
          fileContentType = ctMatch?.[1] || 'application/octet-stream';
          fileData = buffer.subarray(bodyStart, bodyEnd);
        }
      }
    }

    if (pathValue && !fileData) {
      return NextResponse.json({ error: false, data: { files: [pathValue] } });
    }

    if (!fileData || !fileName) {
      return NextResponse.json({ error: false, data: { files: [] } }, { status: 200 });
    }

    const ext = fileName.includes('.') ? fileName.split('.').pop() : 'png';
    const uniqueName = `editor-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('blog-image')
      .upload(uniqueName, fileData, { contentType: fileContentType, upsert: false });

    if (error) {
      return NextResponse.json({ error: true, message: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('blog-image').getPublicUrl(uniqueName);

    // Jodit accepts response in several formats - use single-element array with full URL
    return NextResponse.json({ error: false, data: { files: [urlData.publicUrl] } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}
