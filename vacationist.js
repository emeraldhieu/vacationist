$(document).ready(function() {
	var apiKey = '<fillYourApiKey>';

	$( "#startDate" ).datepicker({ dateFormat: 'yy-mm-ddT00:00:00Z'}).val();

	getMembers();

	$("#book").click(function() {
		var recordId = $('#fullName option:selected').val();
		var startDate = $("#startDate").val();
		var days = parseInt($("#days").val());
		console.log(recordId);

		bookVacation(recordId, startDate, days);
	});

	function getMembers() {
		$.ajax({
			method: 'GET',
			url: 'https://api.gridly.com/v1/views/em36jxomk35vo1/records',
			headers: {
				'Authorization': 'ApiKey ' + apiKey
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('ERROR');
			},
			success: function(data, textStatus, jqXHR) {
				var memberCount = data.length;
				var recordIds = [];
				var fullNames = [];
				for (var i = 0; i < memberCount ; ++i) {
				    var record = data[i];
				    var cells = record.cells;
				    var cellCount = cells.length;

				    // Store recordId.
					var recordId = getRecordId(record);
					recordIds.push(recordId);

				    for (var j = 0; j < cellCount; ++j) {
			    		var cell = cells[j];

			    		// Store fullName.
						if (cell.columnId == 'fullName') {
							var fullName = getFullName(cell);
							fullNames.push(fullName);
						}
				    }
				}

				// Populate select.
				var recordIdLength = recordIds.length;
				for (var i = 0; i < recordIdLength; ++i) {
					var recordId = recordIds[i];
					var fullName = fullNames[i];

					// Populate
					$('#fullName').append("<option value=\"" + recordId + "\">" + fullName + "</option>")	
				}
			}
		});
	}

	function getFullName(cell) {
		if (cell.columnId == 'fullName') {
			return cell.value;
		}
		return "";
	}

	function getRecordId(record) {
		return record.id;
	}

	function bookVacation(fullName, startDate, days) {
		var fullNameCell = {};
		fullNameCell['columnId'] = 'fullName';

		var fullNames = [];
		fullNames.push(fullName)
		fullNameCell['value'] = fullNames;

		var startDateCell = {};
		startDateCell['columnId'] = 'startDate';
		startDateCell['value'] = startDate;

		var daysCell = {};
		daysCell['columnId'] = 'days';
		daysCell['value'] = days;

		var cells = [];
		cells.push(fullNameCell);
		cells.push(startDateCell);
		cells.push(daysCell);

		var record = {};
		record['cells'] = cells;

		var records = [];
		records.push(record);

		console.log(records);

		var bodyJson = JSON.stringify(records);
		console.log(bodyJson);

		$.ajax({
			method: 'POST',
			url: 'https://api.gridly.com/v1/views/418v6p04vx0mnn/records',
			headers: {
				'Authorization': 'ApiKey ' + apiKey,
				'Content-type': 'application/json'
			},
			data: bodyJson,
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('ERROR');

			},
			success: function(data, textStatus, jqXHR) {
				console.log(data);

				$("#result").text("You have booked a leave successfully!!!");
			}
		});
	}
});