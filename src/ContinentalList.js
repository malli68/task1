import React, { useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { isArray } from "@apollo/client/utilities";
import { Toast } from 'primereact/toast';
import { FilterMatchMode } from 'primereact/api';

const GET_DETAILS = gql`
  query {
    continents {
      name
      countries {
        name
        languages {
          native
          name
          code
        }
        phones
        emoji
        capital
        currency
      }
    }
  }
`;
export default function ContinentalList() {
    const { error, data, loading } = useQuery(GET_DETAILS);
    const [datatableData, setDatatableData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    // const [chartData, setChartData] = useState({});
    // const [chartOptions, setChartOptions] = useState({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    useEffect(() => {
        if (!loading && isArray(data.continents)) {
            setDatatableData(data.continents);
        }
    }, [loading]);
    const [expandedRows, setExpandedRows] = useState([]);
    const toast = useRef(null);

    const onRowSelect = (event) => {
        toast.current.show({
            severity: 'info',
            summary: 'Selected Country Details',
            detail: `Country: ${event.data.name}
            Capital: ${event.data.capital}
            Currency: ${event.data.currency} 
            Emoji: ${event.data.emoji}`,
            life: 3000
        });
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Unselected Country Details',
            detail: `Country: ${event.data.name}      
        Capital: ${event.data.capital}
        Currency: ${event.data.currency} `,
            life: 3000
        });
    };

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">
                    {data.name}
                    ({data.countries.length})
                </span>
            </React.Fragment>
        );
    };
    const countryArray = []
    const countryArrayCount = []
    data?.continents?.map((continent) => {
        let cont = continent.name
        let count = continent.countries.length
        countryArrayCount.push(count)
        countryArray.push(cont)
    })
    console.log('countryArray', countryArrayCount)
    useEffect(() => {
        const data = {
            labels: countryArray,
            datasets: [
                {
                    label: 'Continent Vs Country Count ',
                    data: countryArrayCount,
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(140, 245, 39, 0.2)',
                        'rgba(39, 76, 245, 0.2)',
                        'rgba(255, 0, 0, 0.2)',

                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(140, 245, 39)',
                        'rgb(39, 76, 245)',
                        'rgb(255, 0, 0)',

                    ],
                    borderWidth: 1
                }
            ]
        };
    }, []);
    const renderDatatable = (rowData) =>
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                value={rowData.countries}
                removableSort
                paginator
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} countries"
                rows={5}
                rowsPerPageOptions={[5, 10, 15, 25]}
                selectionMode="single"
                selection={selected}
                showGridlines
                onSelectionChange={(e) => setSelected(e.value)}
                dataKey="emoji"
                stateStorage="session"
                stateKey="dt-state-demo-local"
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
                scrollable scrollHeight="400px"
                metaKeySelection={false} >
                <Column field='name' sortable header='Country' />
                <Column field='capital' sortable header='Capital' />
                <Column field='currency' sortable header='Currency' />
                <Column field='emoji' header='Emoji' />
            </DataTable>
        </div >

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search" />
                </span>
            </div>
        );
    };
    const header = renderHeader();
    if (loading) {
        return <div>loading...</div>;
    }

    if (error) return <div>{error.message}</div>;

    return (
        <>
            <DataTable
                value={datatableData ?? []}
                header={header}
                removableSort
                stateStorage="local"
                stateKey="dt-state-demo-local"
                rowGroupMode="subheader"
                groupRowsBy="countries"
                sortMode="single"
                sortField="name"
                sortOrder={1}
                expandableRowGroups
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowGroupHeaderTemplate={headerTemplate}
                showGridlines
                filters={filters} filterDisplay="row"
                globalFilterFields={['name']}
                scrollable scrollHeight="70vh"
                tableStyle={{ minWidth: "50rem" }}
            >

                <Column
                    field="name"
                    body={renderDatatable}
                    sortable
                    header='Continent'
                />
            </DataTable>

        </>
    );
}
