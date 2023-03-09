// Generated with util/create-component.js
import React, { Fragment } from "react";
import "./TableView.css";
import { PaginationStyle, style_cache, tableViewResponse, template_cache, ViewType } from "@airjam/types";
import ViewTable from "../ViewTable";
import { TableViewProps } from "../shared/TableViewProps";
import ListView from "../ListView";
import GraphView from "../GraphView";

const DEFAULT_HOST = "https://airjam.co/s/data?id=";
const PAGINATION_SHOW_SIZE: number = 7;

interface States {
    response?: tableViewResponse;
    page: number;
}

export default class TableView extends React.Component<TableViewProps, States> {

    private _isMounted: boolean = false;

    constructor(props: TableViewProps) {
        super(props);
        this.state = {
            response: this.props.viewData ? this.props.viewData : undefined,
            page: this.props.page ? this.props.page : 1
        };
    }

    componentDidMount() {
        this._isMounted = true;
        if (!this.state.response) this.fetchData(this.state.page);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps: TableViewProps) {
        //todo, if id changes, then reload everything
    }

    render(): React.ReactElement<any> {
        if (!this.state || !this.state.response) return <div key={this.props.id}></div>;
        return <div key={this.props.id}>
            { this.renderView() }
            { this.renderPagination() }
        </div>;
    }

    renderView(): React.ReactElement<any> {
        if (!this.state || !this.state.response) return <Fragment></Fragment>;
        const viewType = ViewType[this.state.response.type.valueOf() as keyof typeof ViewType];
        const template = this.props.template ? this.props.template : this.getTemplate(this.state.response);
        const style = this.props.style ? this.props.style : this.getStyle(this.state.response);
        const styleTag = document.createElement("style");
        styleTag.textContent = style.style;
        document.head.appendChild(styleTag);
        switch(viewType) {
            case ViewType.Graph:
                return <GraphView {...this.props} template={template} page={this.state.page} style={style} viewData={this.state.response} ></GraphView>;
            case ViewType.Table:
                return <ViewTable {...this.props} template={template} page={this.state.page} style={style} viewData={this.state.response} ></ViewTable>;
            case ViewType.List:
                return <ListView {...this.props} template={template} page={this.state.page} style={style} viewData={this.state.response} ></ListView>;
        }
        return <span></span>;
    }

    private fetchData(page: number) {
        if (this.props.id) {
            console.log("fetching page:" + page);
            const hostUrl = this.props.host ? this.props.host : DEFAULT_HOST;
            fetch(hostUrl + this.props.id + "&page=" + page).then((json) => {
                if (json && this._isMounted) {
                    console.log("done fetching page:" + page);
                    json.json().then((response: tableViewResponse) => {
                        if (response && this._isMounted) {
                            this.setState({ response: response });
                            this.forceUpdate();
                        }
                    });
                }
            });
        }
    }

    private getTemplate(fetchedData: tableViewResponse): any {
        const cached_entry = Object.entries(template_cache).filter(value => value[0] === fetchedData.templateId);
        if (cached_entry && cached_entry[0] && cached_entry[0].length > 1) {
            return cached_entry[0][1];
        }
        // return the template data response returned itself.
    }

    private getStyle(fetchedData: tableViewResponse): any {
        const cached_entry = Object.entries(style_cache).filter(value => value[0] === fetchedData.styleId);
        if (cached_entry && cached_entry[0] && cached_entry[0].length > 1) {
            return cached_entry[0][1];
        }
        // return the style data response returned itself.
    }

    private renderPagination(): React.ReactElement<any> {
        if (!this.state.response || this.state.response.paginationStyle !== PaginationStyle.Paged) return <Fragment></Fragment>;
        const viewType = ViewType[this.state.response.type.valueOf() as keyof typeof ViewType];
        if ((viewType !== ViewType.Gallery) && (viewType !== ViewType.List)) return <Fragment></Fragment>;
        let leftPtr = this.state.page ? this.state.page : 1;
        let rightPtr = this.state.page ? this.state.page : 1;
        if (this.state.response.totalPages <= PAGINATION_SHOW_SIZE) {
            leftPtr = 1;
            rightPtr = this.state.response.totalPages;
        } else {
            let pagesLeft = PAGINATION_SHOW_SIZE;
            while (pagesLeft > 0) {
            if (leftPtr > 1) { leftPtr--; pagesLeft--; }
            if (rightPtr <= this.state.response.totalPages) { rightPtr++; pagesLeft--; }
            }
        }
        return <div className="pagination">
            { this.makePageLink(1, "<<") }
            {
                Array.from(Array(rightPtr - leftPtr + 1).keys()).map((idx: number) => {
                    return this.makePageLink(idx + leftPtr, undefined);
                })
            }
            { this.makePageLink(this.state.response.totalPages, ">>") }
        </div>;
    }

    private makePageLink(pageNumber: number, linkText: string | undefined): React.ReactElement<any> {
        if (this.state.page == pageNumber) {
            return <span key={"page." + pageNumber + linkText}>{linkText ? linkText : pageNumber}</span>;
        } else {
            return <a key={"page." + pageNumber + linkText} style={{cursor: "pointer"}} onClick={() => { 
                console.log("Clicked: " + pageNumber);
                this.setState({page: pageNumber});
                this.fetchData(pageNumber);
            }}>{linkText ? linkText : pageNumber}</a>;
        }
    }

}
