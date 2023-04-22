/*************************************************************************
    > Copyright (c) 2023 Netcan
    > File Name: TorrentTable.tsx
    > Blog: https://netcan.github.io/
    > Mail: netcan1996@gmail.com
************************************************************************/

import { DataTableValueArray, DataTableRowClickEvent, DataTable, DataTableSelectionChangeEvent, DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface TorrentTableProps<TValue extends DataTableValueArray> {
    value: TValue;
    selection?: DataTableSelection<TValue>;
    filters?: DataTableFilterMeta;
    onSelectionChange?(event: DataTableSelectionChangeEvent<TValue>): void;
    onRowClick?(event: DataTableRowClickEvent): void;
    children?: React.ReactNode | undefined;
    dataKey?: string;
    globalFilterFields?: string[];
    stateKey?: string;
}

const TorrentTable: React.FC<TorrentTableProps<any>> = (props) => {
    const { selection, onSelectionChange } = props;
    const multipleSelection = Boolean(selection || onSelectionChange);
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
        { props.children }
        </DataTable>
    );
}

export default TorrentTable;
