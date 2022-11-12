let token = localStorage.getItem("token");
let idShowdetail;
showListTrainer(0, 10, '');
    let totalPages = 1;
    function showListTrainer(startPage, size, nameSearch) {
        $.ajax({
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Bearer " + token);
            },
            //tên API
            url: "http://localhost:8080/trainer/page",
            data: {
                page: startPage,
                size: size,
                name: nameSearch
            },
            //xử lý khi thành công
            success: function (response) {
                $('#bootstrap-data-table-export tbody').empty();
                // add table rows
                $.each(response.content, (id, trainer) => {
                    let noteRow = '<tr>' +
                        '<td>' + trainer.name + '</td>' +
                        '<td>' + trainer.dateOfBirth.slice(0,10) + '</td>' +
                        '<td>' + trainer.address + '</td>' +
                        '<td><button type="button" onclick="getDetail(' + trainer.id + ')" class="btn btn-success" data-toggle="modal" data-target="#modalEdit"><i class="fa fa-magic"></i>&nbsp; Edit</button></td>' +
                        '<td><button type="button" onclick="deleteById(' + trainer.id + ')" class="btn btn-danger"><i class="fa fa-rss"></i>&nbsp; Delete</button></td>' +
                        '</tr>';
                    $('#bootstrap-data-table-export tbody').append(noteRow);
                });
                let abc = 'Hiển thị từ ' + ((response.size*response.pageable.pageNumber)+1) + ' tới ' + ((response.size*response.pageable.pageNumber)+response.size) + ' trong ' + response.totalElements + ' HLV';
                $('#bootstrap-data-table-export_info').empty().append(abc);

                // if ($('ul.pagination li').length - 2 != response.totalPages) {
                //     // build pagination list at the first time loading
                // $('ul.pagination').empty();
                // buildPagination(response);
                // }
                $('ul.pagination').empty();
                buildPagination(response);
            },
            error : function(e) {
                alert("ERROR: ", e);
                console.log("ERROR: ", e);
            }
        });
    }

// function này tạo các trang
    function buildPagination(response) {
        totalPages = response.totalPages;

        var pageNumber = response.pageable.pageNumber;

        var numLinks = 10;

        // print 'previous' link only if not on page one
        var first = '';
        var prev = '';
        if (pageNumber > 0) {
            if(pageNumber !== 0) {
                first = '<li class="page-item"><a class="page-link">« First</a></li>';
            }
            prev = '<li class="page-item"><a class="page-link">‹ Prev</a></li>';
        } else {
            prev = ''; // on the page one, don't show 'previous' link
            first = ''; // nor 'first page' link
        }

        // print 'next' link only if not on the last page
        var next = '';
        var last = '';
        if (pageNumber < totalPages) {
            if(pageNumber !== totalPages - 1) {
                next = '<li class="page-item"><a class="page-link">Next ›</a></li>';
                last = '<li class="page-item"><a class="page-link">Last »</a></li>';
            }
        } else {
            next = ''; // on the last page, don't show 'next' link
            last = ''; // nor 'last page' link
        }

        var start = pageNumber - (pageNumber % numLinks) + 1;
        var end = start + numLinks - 1;
        end = Math.min(totalPages, end);
        var pagingLink = '';

        for (var i = start; i <= end; i++) {
            if (i == pageNumber + 1) {
                pagingLink += '<li class="page-item active"><a class="page-link"> ' + i + ' </a></li>'; // no need to create a link to current page
            } else {
                pagingLink += '<li class="page-item"><a class="page-link"> ' + i + ' </a></li>';
            }
        }

        // return the page navigation link
        pagingLink = first + prev + pagingLink + next + last;

        $("ul.pagination").append(pagingLink);
    }

// Hứng sự kiện search
    $(document).on("change", 'div.dataTables_filter label input.form-control.form-control-sm', function() {
        let nameSearch = $(this).val();
        showListTrainer(0, 10, nameSearch);
    });

// Hứng sự kiện size page
    $(document).on("mouseout", 'div.dataTables_length label select.custom-select.custom-select-sm.form-control.form-control-sm', function() {
        let size = $(this).val();
        showListTrainer(0, size, '');
    });

    $(document).on("click", "ul.pagination li a", function() {
        var data = $(this).attr('data');
        let val = $(this).text();
        console.log('val: ' + val);

        // click on the NEXT tag
        if(val.toUpperCase() === "« FIRST") {
            let currentActive = $("li.active");
            showListTrainer(0, 10, '');
            $("li.active").removeClass("active");
            // add .active to next-pagination li
            currentActive.next().addClass("active");
        } else if(val.toUpperCase() === "LAST »") {
            showListTrainer(totalPages - 1, 10, '');
            $("li.active").removeClass("active");
            // add .active to next-pagination li
            currentActive.next().addClass("active");
        } else if(val.toUpperCase() === "NEXT ›") {
            let activeValue = parseInt($("ul.pagination li.active").text());
            if(activeValue < totalPages){
                let currentActive = $("li.active");
                startPage = activeValue;
                showListTrainer(startPage, 10, '');
                // remove .active class for the old li tag
                $("li.active").removeClass("active");
                // add .active to next-pagination li
                currentActive.next().addClass("active");
            }
        } else if(val.toUpperCase() === "‹ PREV") {
            let activeValue = parseInt($("ul.pagination li.active").text());
            if(activeValue > 1) {
                // get the previous page
                startPage = activeValue - 2;
                showListTrainer(startPage, 10, '');
                let currentActive = $("li.active");
                currentActive.removeClass("active");
                // add .active to previous-pagination li
                currentActive.prev().addClass("active");
            }
        } else {
            startPage = parseInt(val - 1);
            showListTrainer(startPage, 10, '');
            // add focus to the li tag
            $("li.active").removeClass("active");
            $(this).parent().addClass("active");
            //$(this).addClass("active");
        }
    });



function addNewTrainer() {
    //lay du lieu
    let address = $('#address').val();
    let cv_file = $('#cv_file').val();
    let date_of_birth = $('#date_of_birth').val();
    let name = $('#name').val();
    let app_user_id = $('#app_user_id').val();
    let income_id = $('#income_id').val();
    let newTrainer = {
        address: address,
        cv_file: cv_file,
        date_of_birth: date_of_birth,
        name: name,
        app_user_id: app_user_id,
        income_id:income_id
    };
    // goi ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newTrainer),
        //tên API
        url: "http://localhost:8080/trainer",
        //xử lý khi thành công
        success: function (){
            showListTrainer();
        }

    });
    //chặn sự kiện mặc định của thẻ
    event.preventDefault();
}

function deleteById(id){
    // goi ajax
    $.ajax({
        type: "DELETE",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        //tên API
        url: "http://localhost:8080/trainer/" + id,
        //xử lý khi thành công
        success: function (data) {
            console.log("Xoa thanh cong ");
            showListTrainer(0, 10, '');
        }

    });
    //chặn sự kiện mặc định của thẻ
    event.preventDefault();
}

function getDetail(getId) {
    idShowdetail = getId;
    $.ajax({
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        //tên API
        url: "http://localhost:8080/trainer/" + getId,
        //xử lý khi thành công
        success: function (response) {
            let placeholderName = '<input type="text" id="edit-name-val" placeholder="' + response.name + '" class="form-control">'
            $('#edit-name').empty().append(placeholderName);
            let placeholderAddress = '<input type="text" id="edit-address-val" placeholder="' + response.address + '" class="form-control">'
            $('#edit-address').empty().append(placeholderAddress);
            let placeholderAcc = '<p class="form-control-static">' + response.appUser.name + '</p>'
            $('#edit-account').empty().append(placeholderAcc);
            let placeholderPass = '<input type="text" id="edit-password-val" placeholder="' + response.appUser.password + '" class="form-control">'
            $('#edit-password').empty().append(placeholderPass);
        },
        error : function(e) {
            alert("ERROR: ", e);
            console.log("ERROR: ", e);
        }
    });
}

// Hứng sự kiện edit
$(document).on("click", 'div.modal-content div.modal-footer button.btn.btn-primary', function() {
    editById(idShowdetail);
});

function editById(id) {
    //lay du lieu
<<<<<<< HEAD
    let address = $('#edit-address').val();
    let cv_file = $('#edit-file').val();
    let date_of_birth = $('#edit-dob').val();
    let name = $('#edit-name').val();
    let object = {
        address: address,
        cv_file: cv_file,
        date_of_birth: date_of_birth,
=======
    let address = $('#edit-address-val').val();
    let cv_file = $('#edit-file-val').val();
    let date_of_birth = $('#edit-dob-val').val();
    let name = $('#edit-name-val').val();
    let object = {
        address: address,
        cvFile: cv_file,
        dateOfBirth: date_of_birth,
>>>>>>> 54a868630c7d6b98690ba5a32c1ed99df674f9ee
        name: name,
    };
    // goi ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
<<<<<<< HEAD
        type: "PUT",
=======
        type: "POST",
>>>>>>> 54a868630c7d6b98690ba5a32c1ed99df674f9ee
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        data: JSON.stringify(object),
        //tên API
<<<<<<< HEAD
        url: "http://localhost:8080/trainer/" + id,
=======
        url: "http://localhost:8080/trainer",
>>>>>>> 54a868630c7d6b98690ba5a32c1ed99df674f9ee
        //xử lý khi thành công
        success: function (){
            showListTrainer(0, 10, '');
        }

    });
    //chặn sự kiện mặc định của thẻ
    event.preventDefault();
}
