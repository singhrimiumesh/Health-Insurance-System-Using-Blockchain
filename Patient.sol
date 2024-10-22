// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Patient {
    struct Record {
        uint256 recordID;
        string patientName;
        string[] allergies;          // Added allergies
        string[] medications;       // Added current medications
        string[] previousConditions; // Added previous conditions
        string diagnosis;
        string treatment;
        uint256 treatmentCost;
        uint256 timestamp;
    }

    mapping(address => Record[]) private patientRecords;

    // Event to notify when a new record is added or updated
    event RecordAdded(address indexed patientAddress, uint256 recordID, string patientName);
    event RecordUpdated(address indexed patientAddress, uint256 recordID, string patientName);

    // Function to add a new medical record
    function addRecord(
        string memory _patientName,
        string[] memory _allergies,
        string[] memory _medications,
        string[] memory _previousConditions,
        string memory _diagnosis,
        string memory _treatment,
        uint256 _treatmentCost
    ) public {
        uint256 recordID = patientRecords[msg.sender].length;
        patientRecords[msg.sender].push(Record(
            recordID,
            _patientName,
            _allergies,
            _medications,
            _previousConditions,
            _diagnosis,
            _treatment,
            _treatmentCost,
            block.timestamp
        ));
        emit RecordAdded(msg.sender, recordID, _patientName);
    }

    // Function to update an existing medical record
    function updateRecord(
        uint256 _recordID,
        string[] memory _allergies,
        string[] memory _medications,
        string[] memory _previousConditions,
        string memory _diagnosis,
        string memory _treatment,
        uint256 _treatmentCost
    ) public {
        require(_recordID < patientRecords[msg.sender].length, "Record does not exist");
        
        Record storage record = patientRecords[msg.sender][_recordID];

        // Update the record with new information
        record.allergies = _allergies;
        record.medications = _medications;
        record.previousConditions = _previousConditions;
        record.diagnosis = _diagnosis;
        record.treatment = _treatment;
        record.treatmentCost = _treatmentCost;

        emit RecordUpdated(msg.sender, _recordID, record.patientName);
    }

    // Function to retrieve patient records
    function getRecords() public view returns (Record[] memory) {
        return patientRecords[msg.sender];
    }

    // Function to get specific record by record ID
    function getRecordByID(uint256 _recordID) public view returns (Record memory) {
        require(_recordID < patientRecords[msg.sender].length, "Record does not exist");
        return patientRecords[msg.sender][_recordID];
    }
}
