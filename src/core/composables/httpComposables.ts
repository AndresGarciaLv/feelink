export function buildQueryParams(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .forEach(([key, value]) => searchParams.append(key, String(value)));

    return searchParams.toString();
}