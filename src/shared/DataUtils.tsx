import { dataField, tableViewResponse } from "@airjam/types";

export function dataToTableMatrix(data: tableViewResponse): dataField[][] {
    const dataRows: dataField[][] = [];
    if (data.data && data.data.length) {
        const keys = Object.keys(data.data[0]);
        const keyMap: {[id: string]: number} = {};
        keys.forEach((key: string, index: number) => { keyMap[key] = index });
        data.data.forEach((currentDataRow: {[id: string]: dataField}) => {
        const rowData: dataField[] = [];
        Object.entries(currentDataRow).forEach((entry: any[]) => {
            rowData[keyMap[entry[0]]] = entry[1];
        });
        dataRows.push(rowData);
        });
    }
    return dataRows;
}

