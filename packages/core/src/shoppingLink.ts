// Link that hands a shopping list from one app to NeLazim: nelazim://add?title=...&items=...
// or https://nelazim.msarinc.com.tr/add?... Plain string parsing, since React Native's URL has no searchParams.

export const NELAZIM_WEB_ORIGIN = 'https://nelazim.msarinc.com.tr';

export interface ShoppingLinkItem {
    name: string;
    /** Free text such as "2 su bardağı"; empty when there is none. */
    quantity: string;
}

export interface ShoppingLink {
    /** Name for a new list, e.g. the recipe's title. */
    title: string;
    items: ShoppingLinkItem[];
}

/** `base` is NELAZIM_WEB_ORIGIN (the default), "nelazim://" or any app origin that serves /add. */
export function buildShoppingLink(link: ShoppingLink, base: string = NELAZIM_WEB_ORIGIN): string {
    const items = link.items.map((i) => (i.quantity ? [i.name, i.quantity] : [i.name]));
    const query = `title=${encodeURIComponent(link.title)}&items=${encodeURIComponent(JSON.stringify(items))}`;
    return `${base.endsWith('/') ? base : `${base}/`}add?${query}`;
}

/** The list in an add link, or null when the URL is not one. */
export function parseShoppingLink(url: string): ShoppingLink | null {
    const [beforeQuery, query = ''] = url.split('#')[0].split('?', 2);
    const path = beforeQuery.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').replace(/\/+$/, '');
    if (path !== 'add' && !path.endsWith('/add')) return null;
    const params: Record<string, string> = {};
    for (const pair of query.split('&')) {
        const at = pair.indexOf('=');
        if (at < 0) continue;
        try {
            params[pair.slice(0, at)] = decodeURIComponent(pair.slice(at + 1).replace(/\+/g, ' '));
        } catch {
            return null;
        }
    }
    let raw: unknown;
    try {
        raw = JSON.parse(params.items ?? '');
    } catch {
        return null;
    }
    if (!Array.isArray(raw)) return null;
    const items = raw
        .filter((i): i is unknown[] => Array.isArray(i) && typeof i[0] === 'string' && i[0].trim() !== '')
        .map((i) => ({ name: (i[0] as string).trim(), quantity: typeof i[1] === 'string' ? i[1].trim() : '' }));
    if (!items.length) return null;
    return { title: (params.title ?? '').trim(), items };
}
