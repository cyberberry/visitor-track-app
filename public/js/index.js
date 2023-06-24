const apiEndpoint = 'https://z1euvook3b.execute-api.us-west-1.amazonaws.com/dev/visitors';
const token = 'vhh23v54bn24msdfjh3k';

function generateTable(data) {
    let tableBody = document.getElementById('main-table').getElementsByTagName('tbody')[0];

    tableBody.innerHTML = '';

    data.forEach(function (visitor) {
        console.log(visitor);
        let row = document.createElement('tr');

        row.dataset.visitorId = visitor.visitorId;

        let nameCell = document.createElement('td');
        nameCell.textContent = visitor.name;
        row.appendChild(nameCell);

        let surnameCell = document.createElement('td');
        surnameCell.textContent = visitor.surname;
        row.appendChild(surnameCell);

        let timeCell = document.createElement('td');
        timeCell.textContent = visitor.time;
        row.appendChild(timeCell);

        let actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
            <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
        `;
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });

    // Add event listeners to edit buttons
    let editButtons = document.querySelectorAll('.edit');
    editButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the visitor data from the table row
            let row = button.closest('tr');
            let name = row.querySelector('td:nth-child(1)').textContent;
            let surname = row.querySelector('td:nth-child(2)').textContent;
            let visitorId = row.dataset.visitorId;

            let visitor = {
                name: name,
                surname: surname
            };

            handleEditVisitor(visitor, visitorId,);
        });
    });

    // Add a click event listener to the "Add" button
    let addButton = document.querySelector('a[href="#addEmployeeModal"]');
    addButton.addEventListener('click', showAddModal);

    // Add a click event listener to the "Add" modal submit button
    document.querySelector('#addEmployeeModal form').addEventListener('submit', handleAddVisitor);

    // Add event listeners to delete buttons
    let deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let row = button.closest('tr');
            let name = row.querySelector('td:nth-child(1)').textContent;
            let surname = row.querySelector('td:nth-child(2)').textContent;
            let visitorId = row.dataset.visitorId;

            let visitor = {
                name: name,
                surname: surname
            };

            handleDeleteVisitor(visitor, visitorId);
        });
    });
}

function refreshData() {
    fetch(apiEndpoint, {
        method: 'GET',
        headers: {
            'X-Amz-Security-Token': token
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            let visitors = data.data;
            generateTable(visitors);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

function showAddModal() {
    $('#addEmployeeModal').modal('show');
}

function handleAddVisitor(event) {
    event.preventDefault();

    let addModal = document.getElementById('addEmployeeModal');
    let nameInput = addModal.querySelector('input[name="add-name"]');
    let surnameInput = addModal.querySelector('input[name="add-surname"]');

    if (nameInput.value && surnameInput.value) {
        let visitor = {
            name: nameInput.value,
            surname: surnameInput.value
        };

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'X-Amz-Security-Token': token
            },
            body: JSON.stringify(visitor)
        })
            .then(function (response) {
                if (response.ok) {
                    refreshData();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
            });

        $('#addEmployeeModal').modal('hide');
        nameInput.value = '';
        surnameInput.value = '';

    }
}

function handleEditVisitor(visitor, visitorId) {
    let editModal = document.getElementById('editEmployeeModal');
    let nameInput = editModal.querySelector('input[name="name"]');
    let surnameInput = editModal.querySelector('input[name="surname"]');
    let saveButton = editModal.querySelector('input[type="submit"]');

    nameInput.value = visitor.name;
    surnameInput.value = visitor.surname;

    saveButton.setAttribute('data-visitor-id', visitorId);

    $('#editEmployeeModal').modal('show');

    document.querySelector('#editEmployeeModal form').addEventListener('submit', function (event) {
        event.preventDefault();
        let visitorId = this.querySelector('input[type="submit"]').getAttribute('data-visitor-id');
        let nameInput = this.querySelector('input[name="name"]');
        let surnameInput = this.querySelector('input[name="surname"]');
        let name = nameInput.value;
        let surname = surnameInput.value;

        if (name && surname) {

            let updatedVisitor = {
                name: name,
                surname: surname
            };

            fetch(apiEndpoint + '/' + visitorId, {
                method: 'PUT',
                headers: {
                    'X-Amz-Security-Token': token
                },
                body: JSON.stringify(updatedVisitor)
            })
                .then(function (response) {
                    if (response.ok) {
                        refreshData();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });

            $('#editEmployeeModal').modal('hide');
        }
    });

}


function handleDeleteVisitor(visitor, visitorId) {
    $('#deleteEmployeeModal').modal('show');

    let deleteButton = document.querySelector('#deleteButton');

    deleteButton.removeEventListener('click', deleteButtonClickHandler);

    // Add a click event listener to the delete button
    function deleteButtonClickHandler() {
        console.log(visitor);
        fetch(apiEndpoint + '/' + visitorId, {
            method: 'DELETE',
            headers: {
                'X-Amz-Security-Token': token
            }
        })
            .then(function (response) {
                if (response.ok) {
                    refreshData();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
            });

        console.log('Deleting visitor:', visitor);

        $('#deleteEmployeeModal').modal('hide');
    }

    deleteButton.addEventListener('click', deleteButtonClickHandler);
}

$(document).ready(function () {
    $('th[data-sortable]').on('click', function () {
        let $table = $(this).closest('table');
        let columnIndex = $(this).index();
        let sortingAsc = $(this).hasClass('sorting-asc');

        $table.find('th[data-sortable]').removeClass('sorting-asc sorting-desc');

        if (sortingAsc) {
            $(this).addClass('sorting-desc');
        } else {
            $(this).addClass('sorting-asc');
        }

        let $rows = $table.find('tbody tr');

        let rowsArray = $rows.toArray();

        rowsArray.sort(function (rowA, rowB) {
            let valueA = $(rowA).find('td').eq(columnIndex).text().toLowerCase();
            let valueB = $(rowB).find('td').eq(columnIndex).text().toLowerCase();

            if (valueA < valueB) {
                return sortingAsc ? -1 : 1;
            } else if (valueA > valueB) {
                return sortingAsc ? 1 : -1;
            } else {
                return 0;
            }
        });

        $table.find('tbody').empty();

        for (let i = 0; i < rowsArray.length; i++) {
            $table.find('tbody').append(rowsArray[i]);
        }
    });
});

function logout() {
    // Clear sessionStorage data
    sessionStorage.clear();
    // Redirect to login.html
    window.location.href = "login.html";
}

window.onload = function () {
    refreshData();
};