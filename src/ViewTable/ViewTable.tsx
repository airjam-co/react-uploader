// Generated with util/create-component.js
import React, { Fragment } from "react";
import { ViewTableProps } from "./ViewTable.types";
import "./ViewTable.css";
import { Label, Table } from "semantic-ui-react";
import { dataField, tableViewResponse } from "@airjam/types";
import { dataToTableMatrix } from "../shared/DataUtils";

interface States { }

export default class ViewTable extends React.Component<ViewTableProps, States> {
    constructor(props: ViewTableProps) {
        super(props);
    }

    componentDidMount(): void {
        //
    }

    componentDidUpdate(prevProps: Readonly<ViewTableProps>, prevState: Readonly<States>, snapshot?: any): void {
        //
    }

    render(): React.ReactElement<any> {
        if (!this.props || !this.props.viewData) return <Fragment></Fragment>;
        const striped: boolean = (this.props.viewData.templateProperties && this.props.viewData.templateProperties.striped) ? (this.props.viewData.templateProperties.striped == "true") : false;
        const caption: string = (this.props.viewData.templateProperties && this.props.viewData.templateProperties.caption) ? this.props.viewData.templateProperties.caption : "";
        const dataMatrix = dataToTableMatrix(this.props.viewData);
        if (dataMatrix.length === 0) return <Fragment></Fragment>;
        return <div className={this.props.style.containerClassNames.join(" ")} >
          <Table celled className={"table table-hover" + striped ? " table-striped" : ""}>
            <Table.Header>
                <Table.Row>
                    {
                        dataMatrix[0].map((value: dataField, index: number) => {
                            return <Table.HeaderCell key={"header." + index}>{value.raw_value}</Table.HeaderCell>})
                    }
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    dataMatrix.map((row: dataField[], index: number) => {
                        if (index === 0) return;
                        return <Table.Row className={this.evenOrOdd(index + 1)} key={"body.row." + index}>
                            {
                                row.map((cell: dataField, colIdx: number) => {
                                    return <Table.Cell key={"body.row." + index + "." + colIdx} className={this.evenOrOdd(colIdx + 1)}>{cell.raw_value}</Table.Cell>
                                })
                            }
                        </Table.Row>
                    })
                }
            </Table.Body>
        </Table>
    </div>;
    }

    private evenOrOdd(index: number): string {
        return index % 2 ? "odd" : "even";
    }

}
