'use client';

/**
 * Simplified navigation hook for Supabase auth
 *
 * Note: Organization/permission features require additional Supabase setup.
 * For now, this hook provides basic user-aware navigation filtering.
 */

import { useMemo } from 'react';
import type { NavItem, NavGroup } from '@/types';

/**
 * Hook to filter navigation items based on user context (simplified for Supabase)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // No access restrictions
      if (!item.access) {
        return true;
      }

      // For now, we show all items unless they require specific org features
      // Organization RBAC would need custom Supabase implementation
      if (item.access.requireOrg) {
        // Without org context, hide org-gated items
        return false;
      }

      return true;
    });
  }, [items]);

  return filteredItems;
}

/**
 * Hook to filter navigation groups based on user context (simplified for Supabase)
 *
 * @param groups - Array of navigation groups to filter
 * @returns Filtered groups (empty groups are removed)
 */
export function useFilteredNavGroups(groups: NavGroup[]) {
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const filteredItems = useFilteredNavItems(allItems);

  return useMemo(() => {
    const filteredSet = new Set(filteredItems.map((item) => item.title));
    return groups
      .map((group) => ({
        ...group,
        items: filteredItems.filter((item) =>
          group.items.some((gi) => gi.title === item.title && filteredSet.has(gi.title))
        )
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, filteredItems]);
}
