// Generated with util/create-component.js
import { dataField, ViewType } from "@airjam/types";
import React, { Fragment } from "react";
import { dataToTableMatrix } from "../shared/DataUtils";
import { GraphViewProps } from "./GraphView.types";
import { Bar, defaults, Doughnut, HorizontalBar, Line, Pie } from "react-chartjs-2";
import "./GraphView.css";

interface States { }

export default class ViewTable extends React.Component<GraphViewProps, States> {
    constructor(props: GraphViewProps) {
        super(props);
    }

    componentDidMount(): void {
        //
    }

    componentDidUpdate(prevProps: Readonly<GraphViewProps>, prevState: Readonly<States>, snapshot?: any): void {
        //
    }

    render(): React.ReactElement<any> {
        // preconditions
        if (!this.props || !this.props.viewData) return <Fragment></Fragment>;
        if (!this.props.style || !this.props.template || !this.props.template.compatibleDisplayType || !Array.isArray(this.props.template.compatibleDisplayType)) return <Fragment></Fragment>;
        if (Array.from(this.props.template.compatibleDisplayType).filter((type: ViewType) => type === ViewType.Graph).length === 0) return <Fragment></Fragment>;

        // template properties
        let chartType: string = "bar";
        if (this.props.template.componentProperties && this.props.template.componentProperties.chartType) chartType = this.props.template.componentProperties.chartType;
        let firstColumnAsLabel: boolean = false;
        if (this.props.viewData.templateProperties && this.props.viewData.templateProperties.useFirstColumnAsLabels && (this.props.viewData.templateProperties.useFirstColumnAsLabels as string).toLowerCase() === "true") {
            firstColumnAsLabel = true;
        }
        let showLegends: boolean = false;
        if (this.props.viewData.templateProperties && this.props.viewData.templateProperties.showLegends && (this.props.viewData.templateProperties.showLegends as string).toLowerCase() === "true") {
            showLegends = true;
        }
        let roundedBars: boolean = false;
        if (this.props.viewData.templateProperties && this.props.viewData.templateProperties.roundedBars && (this.props.viewData.templateProperties.roundedBars as string).toLowerCase() === "true") {
            roundedBars = true;
        }
        let stackedBars: boolean = false;
        if (this.props.viewData.templateProperties && this.props.viewData.templateProperties.stackedBars && (this.props.viewData.templateProperties.stackedBars as string).toLowerCase() === "true") {
            stackedBars = true;
        }
        let indexAxis: "x" | "y" = "x";
        if (this.props.viewData.templateProperties && this.props.viewData.templateProperties.showVertically && (this.props.viewData.templateProperties.showVertically as string).toLowerCase() === "true") {
            indexAxis = "y";
        }
        let borderWidth: number = 0;
        if (this.props.style.componentProperties && this.props.style.componentProperties.borderWidth) {
            borderWidth = (this.props.style.componentProperties.borderWidth as number);
        }
        let chartColors: string[] = [];
        if (this.props.style.colorTheme && Array.isArray(this.props.style.colorTheme)) {
            chartColors = this.props.style.colorTheme;
        }

        const dataMatrix = dataToTableMatrix(this.props.viewData);
        if (dataMatrix && dataMatrix.length) {
            // first row is assumed to be labels for this component
            const labelRow = dataMatrix[0].map((value: dataField) => {
                return value.raw_value;
            });
            const dataRows = [];
            for (let i = 1; i < dataMatrix.length; i++) {
                const dataArr = dataMatrix[i].map((value: dataField) => {
                    return parseFloat(value.raw_value);
                });
                this.props.viewData.data.forEach(() => { chartColors = this.rotateArray(chartColors, true) }); // rotate the colors far enough to hopefully not get duplicates
                dataRows.push({
                    label: firstColumnAsLabel ? dataArr[0] : undefined,
                    data: firstColumnAsLabel ? dataArr.slice(1) : dataArr,
                    borderWidth: borderWidth,
                    borderRadius: roundedBars ? 500 : 0,
                    borderColor: chartColors.slice(),
                    backgroundColor: chartColors.slice()
                });
            }
            switch(chartType.toLowerCase()) {
                case "bar":
                    if (indexAxis == "y") {
                        return <HorizontalBar key={"chart." + this.props.id} options={{
                            responsive: true,
                            legend: {
                                display: showLegends,
                            },
                            scales: {
                                xAxes: [{
                                    stacked: stackedBars
                                }],
                                yAxes: [{
                                    stacked: stackedBars
                                }]
                            }
                        }} data={{ labels: labelRow, datasets: dataRows }} type={undefined} />;
                    } else {
                        return <Bar key={"chart." + this.props.id} options={{
                            responsive: true,
                            legend: {
                                display: showLegends,
                            },
                            scales: {
                                xAxes: [{
                                    stacked: stackedBars
                                }],
                                yAxes: [{
                                    stacked: stackedBars
                                }]
                            }
                        }} data={{ labels: labelRow, datasets: dataRows }} type={undefined} />;
                    }
                case "line":
                    return <Line key={"chart." + this.props.id} options={{
                        indexAxis: indexAxis,
                        responsive: true,
                             legend: {
                                display: showLegends,
                            },
                   }} data={{ labels: labelRow, datasets: dataRows }} type={undefined} />;
                case "pie":
                    return <Pie key={"chart." + this.props.id} options={{
                        indexAxis: indexAxis,
                        responsive: true,
                        legend: {
                            display: showLegends,
                        },
                    }} data={{ labels: labelRow, datasets: dataRows }} type={undefined} />;
                case "doughnut":
                    return <Doughnut key={"chart." + this.props.id} options={{
                        indexAxis: indexAxis,
                        responsive: true,
                        legend: {
                            display: showLegends,
                        },
                    }} data={{ labels: labelRow, datasets: dataRows }} type={undefined} />;
            }
        }
        return <div key={"chart." + this.props.id}></div>;
    }

    private rotateArray(arr: any[], reverse: boolean): any[] {
        if (reverse) arr.unshift(arr.pop());
        else arr.push(arr.shift());
        return arr;
    }

}
