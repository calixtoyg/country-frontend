import React from 'react';

const Country = () => {
    const columns = [
        {
            field: "name",
            headerName:

        }
    ]




    return (
        <div style={{ height: 800, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
            />
        </div>
    );
};

export default Country;
