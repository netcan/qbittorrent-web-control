/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: TorrentTable.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import { DataTableValueArray, DataTableRowClickEvent, DataTable, DataTableSelectionChangeEvent, DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import _ from 'lodash';

type ElementOf<T> = T extends (infer U)[] ? U : never;

interface TorrentTableProps<TArray extends DataTableValueArray> {
    value: TArray;
    selection?: DataTableSelection<TArray>;
    filters?: DataTableFilterMeta;
    onSelectionChange?(event: DataTableSelectionChangeEvent<TArray>): void;
    onRowClick?(event: DataTableRowClickEvent): void;
    dataKey?: keyof ElementOf<TArray> & string;
    globalFilterFields?: (keyof ElementOf<TArray> & string)[];
    stateKey?: string;
    columns: {
        field: keyof ElementOf<TArray> & string,
        label: string,
    }[],
    parseColumn?(field: keyof ElementOf<TArray>, value: ElementOf<TArray>): React.ReactNode;
    paging?: boolean,
}

const TorrentTable = <T extends DataTableValueArray>(props: TorrentTableProps<T>) => {
    const { columns, parseColumn, paging, ...rest } = props;
    const multipleSelection = Boolean(props.selection && props.onSelectionChange);
    const pagingOpt = paging ? {
        rows: 200,
        rowsPerPageOptions: [50, 100, 200, 500],
        paginator: true,
    } : null;
    return (
        <DataTable
            className='torrent-table'
            stripedRows
            removableSort
            resizableColumns
            columnResizeMode="expand"
            selectionMode={ multipleSelection ? 'checkbox' : 'single' }
            reorderableColumns
            scrollable scrollHeight='flex'
            selectionPageOnly={true}
            dragSelection={ multipleSelection }
            stateStorage='local'
            {...rest}
            {...pagingOpt}
        >
        { multipleSelection && <Column selectionMode="multiple"></Column> }
        { columns.map((col) => (
            <Column
                sortable
                header={col.label}
                key={col.field}
                field={col.field}
                body={parseColumn && _.partial(parseColumn, col.field)}
            />
        )) }
        </DataTable>
    );
}

export default TorrentTable;
