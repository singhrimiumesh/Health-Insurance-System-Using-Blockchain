import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Insurance = ({ goBack }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [claims, setClaims] = useState([]);
    
    const [patientName, setPatientName] = useState('');
    const [coverageDetails, setCoverageDetails] = useState('');
    const [premiumAmount, setPremiumAmount] = useState(0);
    const [policyID, setPolicyID] = useState('');
    const [claimDescription, setClaimDescription] = useState('');
    const [claimAmount, setClaimAmount] = useState(0);

    const contractAddress = "0xe49ca432bb11e9f6fec83f6b747ac511e800ef89";

    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "claimID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "policyID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "claimAmount",
                    "type": "uint256"
                }
            ],
            "name": "ClaimFiled",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "claimID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "policyID",
                    "type": "uint256"
                }
            ],
            "name": "ClaimSettled",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "policyID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "policyHolder",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "patientName",
                    "type": "string"
                }
            ],
            "name": "PolicyCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "claims",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "claimID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "policyID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "claimAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isSettled",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_patientName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_coverageDetails",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_premiumAmount",
                    "type": "uint256"
                }
            ],
            "name": "createPolicy",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_policyID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_claimAmount",
                    "type": "uint256"
                }
            ],
            "name": "fileClaim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getClaims",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "claimID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "policyID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "claimAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isSettled",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Insurance.Claim[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPolicies",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "policyID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "policyHolder",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "patientName",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "coverageDetails",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "premiumAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct Insurance.Policy[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_policyID",
                    "type": "uint256"
                }
            ],
            "name": "getPolicyClaims",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "claimID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "policyID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "claimAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isSettled",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Insurance.Claim[]",
                    "name": "",
                    "type": "tuple[]"
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
            "name": "policies",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "policyID",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "policyHolder",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "patientName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "coverageDetails",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "premiumAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isActive",
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
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "policyClaims",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "claimID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "policyID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "claimAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isSettled",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_claimID",
                    "type": "uint256"
                }
            ],
            "name": "settleClaim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                setProvider(provider);
                setSigner(signer);

                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);

                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(contract);

                await fetchPolicies(); // Fetch policies on load
                await fetchClaims(); // Fetch claims on load
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        };
        connectWallet();
    }, []);

    const fetchPolicies = async () => {
        try {
            const policiesData = await contract.getPolicies();
            setPolicies(policiesData);
        } catch (error) {
            console.error("Error fetching policies", error);
        }
    };

    const fetchClaims = async () => {
        try {
            const claimsData = await contract.getClaims();
            setClaims(claimsData);
        } catch (error) {
            console.error("Error fetching claims", error);
        }
    };

    const createPolicy = async () => {
        try {
            const tx = await contract.createPolicy(patientName, coverageDetails, premiumAmount);
            await tx.wait();
            alert('Policy created successfully!');
            fetchPolicies();
        } catch (error) {
            console.error("Error creating policy", error);
        }
    };

    const fileClaim = async () => {
        try {
            const tx = await contract.fileClaim(policyID, claimDescription, claimAmount);
            await tx.wait();
            alert('Claim filed successfully!');
            fetchClaims();
        } catch (error) {
            console.error("Error filing claim", error);
        }
    };

    const settleClaim = async (claimID) => {
        try {
            const tx = await contract.settleClaim(claimID);
            await tx.wait();
            alert('Claim settled successfully!');
            fetchClaims();
        } catch (error) {
            console.error("Error settling claim", error);
        }
    };

    return (
        <div className='container'>
            <button className="back-button" onClick={goBack}>Back</button>
            <h1 className="title">Insurance Management</h1>
            {account && <p className='account-info'>Connected Account: {account}</p>}

            <div className='form-section'>
                <h2>Create Insurance Policy</h2>
                <input className='input-field' type='text' placeholder='Patient Name' value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                <input className='input-field' type='text' placeholder='Coverage Details' value={coverageDetails} onChange={(e) => setCoverageDetails(e.target.value)} />
                <input className='input-field' type='number' placeholder='Premium Amount' value={premiumAmount} onChange={(e) => setPremiumAmount(e.target.value)} />
                <button className='action-button' onClick={createPolicy}>Create Policy</button>
            </div>

            <div className='form-section'>
                <h2>File Claim</h2>
                <input className='input-field' type='number' placeholder='Policy ID' value={policyID} onChange={(e) => setPolicyID(e.target.value)} />
                <input className='input-field' type='text' placeholder='Claim Description' value={claimDescription} onChange={(e) => setClaimDescription(e.target.value)} />
                <input className='input-field' type='number' placeholder='Claim Amount' value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} />
                <button className='action-button' onClick={fileClaim}>File Claim</button>
            </div>

            <div className='form-section'>
                <h2>Policies</h2>
                {policies.length > 0 ? (
                    policies.map((policy, index) => (
                        <div key={index}>
                            <p>Policy ID: {policy.policyID.toNumber()}</p>
                            <p>Patient Name: {policy.patientName}</p>
                            <p>Coverage Details: {policy.coverageDetails}</p>
                            <p>Premium Amount: {ethers.utils.formatEther(policy.premiumAmount)} ETH</p>
                            <p>Status: {policy.isActive ? "Active" : "Inactive"}</p>
                        </div>
                    ))
                ) : (
                    <p>No policies found.</p>
                )}
            </div>

            <div className='form-section'>
                <h2>Claims</h2>
                {claims.length > 0 ? (
                    claims.map((claim, index) => (
                        <div key={index}>
                            <p>Claim ID: {claim.claimID.toNumber()}</p>
                            <p>Policy ID: {claim.policyID.toNumber()}</p>
                            <p>Description: {claim.description}</p>
                            <p>Claim Amount: {ethers.utils.formatEther(claim.claimAmount)} ETH</p>
                            <p>Status: {claim.isSettled ? "Settled" : "Pending"}</p>
                            {!claim.isSettled && <button className='action-button' onClick={() => settleClaim(claim.claimID)}>Settle Claim</button>}
                        </div>
                    ))
                ) : (
                    <p>No claims found.</p>
                )}
            </div>
        </div>
    );
};

export default Insurance;
