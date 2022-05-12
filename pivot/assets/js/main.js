var monthly_data;
var yearly_data;
var selectedGrade = 'Grade 6';
var grades = [];
var boards = [];
var grade_data;
var selectedBoard = 'general'
$(document).ready(function() {

    // making ajax calll for reading data.json
    $.ajax({
        url: "data.json",
        success: function(result) {

            // destructuring data and assign into  monthly and yearly variables
            [monthly_data, yearly_data] = result;
            // console.log(monthly_data);

            //making grades array
            monthly_data['monthly'].forEach(element => {
                grades.push(element['grade']);
            });

            grades.forEach(element => {
                var options = '<option value="' + element + '">' + element + '</option>';
                $('#grades').append(options);
                // console.log(options);
            });

            fetchDataOnGradeandBoard();

        }

    });


    ///implementing on change event of select box
    $('#grades').on('change', function() {
        selectedGrade = $('#grades').val();
        // console.log(selectedGrade);
        fetchDataOnGradeandBoard();
    });

    // fetching data on change of board
    $('#boards').on('change', function() {
        selectedBoard = $('#boards').val();
        // console.log(selectedGrade);
        fetchDataOnGradeandBoard(true);
    });

    // fetching data onthe basis of grade selection
    function fetchDataOnGradeandBoard(isBoardChanged = false) {
        $('.montlyReport').empty();
        let gradeData;
        let data;
        boards = [];

        gradeData = $.grep(monthly_data['monthly'], function(element) {
            return element['grade'] == selectedGrade.toString();
        });

        grade_data = gradeData;
        if (!isBoardChanged) {
            fetchBoardOnselectionOfGrade();
        }

        data = $.map(gradeData[0]['boards'][selectedBoard], function(value, index) {
            return value;
        });
        renderUI(data);

        // console.log(gradeData, data);

    }


    // fetching list of boards on selection of grades
    function fetchBoardOnselectionOfGrade() {
        board = [];
        $('#boards').empty();
        // console.log(grade_data);
        $.each(grade_data, function(key, value) {
            $.each(value['boards'], function(key, value) {
                boards.push(key);
            });
        });
        console.log(boards);
        boards.forEach(element => {
            var options = '<option value="' + element + '" selected>' + element + '</option>';
            $('#boards').append(options);
            $("#boards").val(boards[0]);
            selectedBoard = $("#boards").val();
            // console.log(options);
        });
        console.log(selectedBoard);
    }

    function renderUI(data) {
        data.forEach(element => {
            // console.log(element);
            element['discounted_price'] = element['price'] - (element['price'] / element['discount']).toFixed(2);
            // console.log(element['price'] - (element['price'] / element['discount']));
            var row = '<div class="row">';
            row += '<div class="radioButton">';
            row += '<input type="radio" name="duration" id="' + element['valid'].replace(' ', '_') + '" value="' + element['valid'] + '" /> <label for="' + element['valid'].replace(' ', '_') + '">' + element['valid'] + '<p>' + element['refund'] + '</p></label>';

            row += '</div>';

            row += '<div class="price">';
            row += '<p>&#8377;' + element['discounted_price'] + '<del>' + element['price'] + '</del></p><span>' + element['discount'] + '% OFF</span>';
            row += '</div>';
            row += '<div class="per_session_price">';
            row += '<p>&#8377; ' + element['per_class_price'] + 'price per session</p> <span>' + element['total_sessions'] + ' Sessions</span>';
            row += '</div>';
            row += '</div>';
            $('.montlyReport').append(row);
        });
    }
    // alert('documnet ready');
})