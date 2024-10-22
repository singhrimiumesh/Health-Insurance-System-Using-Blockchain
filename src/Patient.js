import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Patient = ({ goBack }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [patientRecords, setPatientRecords] = useState([]);
    
    const [recordID, setRecordID] = useState('');
    const [patientName, setPatientName] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medications, setMedications] = useState('');
    const [previousConditions, setPreviousConditions] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [treatmentCost, setTreatmentCost] = useState('');

    const contractAddress = "0x0e3fcd384834317672bcb5566abda3a8a9f186fb"; // Replace with your deployed contract address
    
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_patientName",
                    "type": "string"
                },
                {
                    "internalType": "string[]",
                    "name": "_allergies",
                    "type": "string[]"
                },
                {
                    "internalType": "string[]",
                    "name": "_medications",
                    "type": "string[]"
                },
                {
                    "internalType": "string[]",
                    "name": "_previousConditions",
                    "type": "string[]"
                },
                {
                    "internalType": "string",
                    "name": "_diagnosis",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_treatment",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_treatmentCost",
                    "type": "uint256"
                }
            ],
            "name": "addRecord",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "patientAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "recordID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "patientName",
                    "type": "string"
                }
            ],
            "name": "RecordAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "patientAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "recordID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "patientName",
                    "type": "string"
                }
            ],
            "name": "RecordUpdated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_recordID",
                    "type": "uint256"
                },
                {
                    "internalType": "string[]",
                    "name": "_allergies",
                    "type": "string[]"
                },
                {
                    "internalType": "string[]",
                    "name": "_medications",
                    "type": "string[]"
                },
                {
                    "internalType": "string[]",
                    "name": "_previousConditions",
                    "type": "string[]"
                },
                {
                    "internalType": "string",
                    "name": "_diagnosis",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_treatment",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_treatmentCost",
                    "type": "uint256"
                }
            ],
            "name": "updateRecord",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_recordID",
                    "type": "uint256"
                }
            ],
            "name": "getRecordByID",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "recordID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "patientName",
                            "type": "string"
                        },
                        {
                            "internalType": "string[]",
                            "name": "allergies",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string[]",
                            "name": "medications",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string[]",
                            "name": "previousConditions",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string",
                            "name": "diagnosis",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "treatment",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "treatmentCost",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Patient.Record",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getRecords",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "recordID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "patientName",
                            "type": "string"
                        },
                        {
                            "internalType": "string[]",
                            "name": "allergies",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string[]",
                            "name": "medications",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string[]",
                            "name": "previousConditions",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string",
                            "name": "diagnosis",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "treatment",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "treatmentCost",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Patient.Record[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
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

                await fetchPatientRecords(); // Fetch records on load
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        };
        connectWallet();
    }, []);

    const fetchPatientRecords = async () => {
        try {
            const records = await contract.getRecords();
            setPatientRecords(records);
        } catch (error) {
            console.error("Error fetching patient records", error);
        }
    };

    const addRecord = async () => {
        try {
            const _allergies = allergies.split(',').map(a => a.trim());
            const _medications = medications.split(',').map(m => m.trim());
            const _previousConditions = previousConditions.split(',').map(pc => pc.trim());

            const tx = await contract.addRecord(
                patientName,
                _allergies,
                _medications,
                _previousConditions,
                diagnosis,
                treatment,
                treatmentCost
            );
            await tx.wait();
            alert('Record added successfully!');
            fetchPatientRecords();
        } catch (error) {
            console.error("Error adding record", error);
        }
    };

    const updateRecord = async () => {
        try {
            const _allergies = allergies.split(',').map(a => a.trim());
            const _medications = medications.split(',').map(m => m.trim());
            const _previousConditions = previousConditions.split(',').map(pc => pc.trim());

            const tx = await contract.updateRecord(
                recordID,
                _allergies,
                _medications,
                _previousConditions,
                diagnosis,
                treatment,
                treatmentCost
            );
            await tx.wait();
            alert('Record updated successfully!');
            fetchPatientRecords();
        } catch (error) {
            console.error("Error updating record", error);
        }
    };

    return (
        <div className='container'>
            <button className="back-button" onClick={goBack}>Back</button>
            <h1 className="title">Patient Health Records</h1>
            {account && <p className='account-info'>Connected Account: {account}</p>}

            <div className='form-section'>
                <h2>Add Patient Record</h2>
                <input className='input-field' type='text' placeholder='Patient Name' value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                <input className='input-field' type='text' placeholder='Allergies (comma-separated)' value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                <input className='input-field' type='text' placeholder='Medications (comma-separated)' value={medications} onChange={(e) => setMedications(e.target.value)} />
                <input className='input-field' type='text' placeholder='Previous Conditions (comma-separated)' value={previousConditions} onChange={(e) => setPreviousConditions(e.target.value)} />
                <input className='input-field' type='text' placeholder='Diagnosis' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                <input className='input-field' type='text' placeholder='Treatment' value={treatment} onChange={(e) => setTreatment(e.target.value)} />
                <input className='input-field' type='number' placeholder='Treatment Cost' value={treatmentCost} onChange={(e) => setTreatmentCost(e.target.value)} />
                <button className='action-button' onClick={addRecord}>Add Record</button>
            </div>

            <div className='form-section'>
                <h2>Update Patient Record</h2>
                <input className='input-field' type='number' placeholder='Record ID' value={recordID} onChange={(e) => setRecordID(e.target.value)} />
                <input className='input-field' type='text' placeholder='Allergies (comma-separated)' value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                <input className='input-field' type='text' placeholder='Medications (comma-separated)' value={medications} onChange={(e) => setMedications(e.target.value)} />
                <input className='input-field' type='text' placeholder='Previous Conditions (comma-separated)' value={previousConditions} onChange={(e) => setPreviousConditions(e.target.value)} />
                <input className='input-field' type='text' placeholder='Diagnosis' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                <input className='input-field' type='text' placeholder='Treatment' value={treatment} onChange={(e) => setTreatment(e.target.value)} />
                <input className='input-field' type='number' placeholder='Treatment Cost' value={treatmentCost} onChange={(e) => setTreatmentCost(e.target.value)} />
                <button className='action-button' onClick={updateRecord}>Update Record</button>
            </div>

            <div className='records-section'>
                <h2>Your Patient Records</h2>
                {patientRecords.length > 0 ? (
                    patientRecords.map((record, index) => (
                        <div key={index}>
                            <p>Record ID: {record.recordID.toNumber()}</p>
                            <p>Patient Name: {record.patientName}</p>
                            <p>Allergies: {record.allergies.join(', ')}</p>
                            <p>Medications: {record.medications.join(', ')}</p>
                            <p>Previous Conditions: {record.previousConditions.join(', ')}</p>
                            <p>Diagnosis: {record.diagnosis}</p>
                            <p>Treatment: {record.treatment}</p>
                            <p>Treatment Cost: {record.treatmentCost.toNumber()}</p>
                            <p>Timestamp: {new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No records found.</p>
                )}
            </div>
        </div>
    );
};

export default Patient;
