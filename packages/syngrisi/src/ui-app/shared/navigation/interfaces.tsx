export interface INavDataItem {
    title: string,
    description: string,
    group?: string,
    icon?: any,
    crumbs: { title: string, href: string }[],
}
