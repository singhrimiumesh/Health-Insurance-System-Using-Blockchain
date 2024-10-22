// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Insurance {
    struct Policy {
        uint256 policyID;
        address policyHolder;
        string patientName;
        string coverageDetails;
        uint256 premiumAmount;
        bool isActive;
    }

    struct Claim {
        uint256 claimID;
        uint256 policyID;
        string description;
        uint256 claimAmount;
        bool isSettled;
        uint256 timestamp;
    }

    Policy[] public policies;
    Claim[] public claims;
    mapping(uint256 => Claim[]) public policyClaims; // Mapping of policy ID to its claims

    event PolicyCreated(uint256 policyID, address policyHolder, string patientName);
    event ClaimFiled(uint256 claimID, uint256 policyID, string description, uint256 claimAmount);
    event ClaimSettled(uint256 claimID, uint256 policyID);

    function createPolicy(string memory _patientName, string memory _coverageDetails, uint256 _premiumAmount) public {
        uint256 policyID = policies.length;
        policies.push(Policy(policyID, msg.sender, _patientName, _coverageDetails, _premiumAmount, true));
        emit PolicyCreated(policyID, msg.sender, _patientName);
    }

    function fileClaim(uint256 _policyID, string memory _description, uint256 _claimAmount) public {
        require(_policyID < policies.length, "Invalid Policy ID");
        require(policies[_policyID].policyHolder == msg.sender, "You are not the policyholder");
        require(policies[_policyID].isActive, "Policy is not active");

        uint256 claimID = claims.length;
        claims.push(Claim(claimID, _policyID, _description, _claimAmount, false, block.timestamp));
        policyClaims[_policyID].push(claims[claimID]);
        emit ClaimFiled(claimID, _policyID, _description, _claimAmount);
    }

    function settleClaim(uint256 _claimID) public {
        require(_claimID < claims.length, "Invalid Claim ID");
        Claim storage claim = claims[_claimID];
        Policy storage policy = policies[claim.policyID];

        require(policy.policyHolder == msg.sender, "You are not the policyholder");
        require(!claim.isSettled, "Claim is already settled");

        claim.isSettled = true;
        emit ClaimSettled(_claimID, claim.policyID);
    }

    function getPolicies() public view returns (Policy[] memory) {
        return policies;
    }

    function getClaims() public view returns (Claim[] memory) {
        return claims;
    }

    function getPolicyClaims(uint256 _policyID) public view returns (Claim[] memory) {
        return policyClaims[_policyID];
    }
}
