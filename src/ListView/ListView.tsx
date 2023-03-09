// Generated with util/create-component.js
import React, { Fragment } from "react";
import { ListViewProps } from "./ListView.types";
import "./ListView.css";

interface States { }

export default class ListView extends React.Component<ListViewProps, States> {
    constructor(props: ListViewProps) {
        super(props);
    }

    componentDidMount(): void {
        //
    }

    componentDidUpdate(prevProps: Readonly<ListViewProps>, prevState: Readonly<States>, snapshot?: any): void {
        //
    }

    render(): React.ReactElement<any> {
        if (!this.props || !this.props.viewData || !this.props.template || !this.props.template.templateFields || !this.props.template.templateContent) return <Fragment></Fragment>;
        const contentList = [];
        for(let i = 1; i < this.props.viewData.data.length; i++) {
            const currentRow = this.props.viewData.data[i];
            const templateMap: {[id: string]: string} = {};

            Object.keys(this.props.template.templateFields).forEach((field: string) => {
                if (this.props.viewData.templateFields[field] && currentRow[this.props.viewData.templateFields[field]]) {
                    templateMap[field] = currentRow[this.props.viewData.templateFields[field]].raw_value;
                }
            });
            let templateContent = this.props.template.templateContent;
            Object.entries(templateMap).forEach((entry: any[]) => {
                const key = entry[0];
                const value = entry[1];
                templateContent = templateContent.replaceAll( "{{" + key + "}}", value);
            });
            contentList.push(<div key={ "list." + i } dangerouslySetInnerHTML={{__html: templateContent}}></div>);
        }

        return <div className={this.props.style.containerClassNames.join(" ")} >
        {
            contentList.map((content) => content)
        }
        </div>;
    }

}
