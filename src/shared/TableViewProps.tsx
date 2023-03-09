import { ComponentTemplate, tableViewResponse, TemplateStyle } from "@airjam/types";

export interface TableViewProps {
    id: string;
    host?: string;
    viewData?: tableViewResponse;
    template?: ComponentTemplate;
    style?: TemplateStyle;
    page?: number;
}