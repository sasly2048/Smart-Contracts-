// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address  public admin;

    constructor()
    {
        admin = msg.sender;
    }

    struct Candidate 
    {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;

    mapping (address => bool) public hasVoted;

    function addCandidate (string memory _name) public 
    {
        require (msg.sender == admin, "Only admin can add candidates");
        candidates.push(Candidate(_name,0));
    }

    function vote (uint _candidateIndex) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateIndex < candidates.length,"Invalid Candidate");
        candidates[_candidateIndex].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function getCandidatesCount() public view returns(uint) {
        return candidates.length;
    }











}