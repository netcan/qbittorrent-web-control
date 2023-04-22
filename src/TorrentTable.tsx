import { DataTableValueArray, DataTableRowClickEvent, DataTable, DataTableSelectionChangeEvent, DataTableSelection, DataTableFilterMeta } from 'primereact/datatable';

interface TorrentTableProps<TValue extends DataTableValueArray> {
    value: TValue;
    selection?: DataTableSelection<TValue>;
    filters?: DataTableFilterMeta;
    onSelectionChange?(event: DataTableSelectionChangeEvent<TValue>): void;
    onRowClick?(event: DataTableRowClickEvent): void;
    children?: React.ReactNode | undefined;
    dataKey?: string;
    globalFilterFields?: string[];
    selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';
    stateKey?: string;
}

const TorrentTable: React.FC<TorrentTableProps<any>> = (props) => {
    return (
        <DataTable
            {...props}
            className='torrent-table'
            stripedRows paginator
            removableSort
            resizableColumns
            columnResizeMode="expand"
            reorderableColumns
            scrollable scrollHeight='flex'
            selectionPageOnly={true}
            dragSelection
            stateStorage='local'
            rows={200} rowsPerPageOptions={[50, 100, 200, 500]}
        >
        </DataTable>
    );
}

export default TorrentTable;
