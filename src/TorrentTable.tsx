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
    dataKey?: string;
    globalFilterFields?: string[];
    stateKey?: string;
    columns: {
        field: (keyof ElementOf<TArray>) & string,
        label: string,
    }[],
    parseColumn?(field: keyof ElementOf<TArray>, value: ElementOf<TArray>): React.ReactNode;
}

const TorrentTable = <T extends DataTableValueArray>(props: TorrentTableProps<T>) => {
    const { selection, onSelectionChange } = props;
    const multipleSelection = Boolean(selection && onSelectionChange);
    return (
        <DataTable
            {...props}
            className='torrent-table'
            stripedRows paginator
            removableSort
            resizableColumns
            columnResizeMode="expand"
            selectionMode={ multipleSelection ? 'checkbox' : 'single' }
            reorderableColumns
            scrollable scrollHeight='flex'
            selectionPageOnly={true}
            dragSelection={ multipleSelection }
            stateStorage='local'
            rows={200} rowsPerPageOptions={[50, 100, 200, 500]}
        >
        { multipleSelection && <Column selectionMode="multiple"></Column> }
        { props.columns.map((col) => (
            <Column
                sortable
                header={col.label}
                key={col.field}
                field={col.field}
                body={props.parseColumn && _.partial(props.parseColumn, col.field)}
            />
        )) }
        </DataTable>
    );
}

export default TorrentTable;
