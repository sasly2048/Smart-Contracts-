const contractAddress = "0x0fB16b4387078aC97F4Bf9c985a9df292cc6ecb9";
const contractABI = [[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCandidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateIndex",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]];

let provider;
let signer;
let contract;

const connectButton = document.getElementById("connectButton");
const walletAddressText = document.getElementById("walletAddress");
const candidatesList = document.getElementById("candidatesList");

connectButton.onclick = async () => {

    if (typeof window.ethereum !== "undefined") {

        await window.ethereum.request({ method: "eth_requestAccounts" });

        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        const address = await signer.getAddress();
        walletAddressText.innerText = "Connected: " + address;

        contract = new ethers.Contract(contractAddress, contractABI, signer);

        loadCandidates();

    } else {
        alert("Please install MetaMask!");
    }
};

async function loadCandidates() {

    candidatesList.innerHTML = "";

    const count = await contract.getCandidatesCount();

    for (let i = 0; i < count; i++) {

        const candidate = await contract.candidates(i);

        const div = document.createElement("div");
        div.className = "candidate";

        div.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>Votes: ${candidate.voteCount}</p>
            <button onclick="vote(${i})">Vote</button>
        `;

        candidatesList.appendChild(div);
    }
}

async function vote(index) {

    try {
        const tx = await contract.vote(index);
        await tx.wait();

        alert("Vote Successful!");
        loadCandidates();

    } catch (error) {
        alert("Error: " + error.reason);
    }
}