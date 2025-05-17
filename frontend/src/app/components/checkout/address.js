'use client';
import { useState } from 'react';
import './address.css';
import { FaMapMarkerAlt, FaPlus, FaTimes } from 'react-icons/fa';

const Address = ({ onAddressChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        addressDetail: '',
        province: '',
        district: '',
        postalCode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed: ${name} = ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSelectedAddress(formData);
        setShowModal(false);
        onAddressChange(formData);
    };

    return (
        <div className="address-component">
            {!selectedAddress ? (
                <div className="no-address">
                    <div className="no-address-content">
                        <FaMapMarkerAlt className="location-icon" />
                        <p>No delivery address added</p>
                        <button className="add-address-btn" onClick={() => setShowModal(true)}>
                            <FaPlus />
                            <span>Add New Address</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="address-display">
                    <div className="address-info">
                        <div className="address-header">
                            <span className="name">{selectedAddress.fullName}</span>
                            <span className="phone">{selectedAddress.phoneNumber}</span>
                        </div>
                        <p className="address-text">
                            {selectedAddress.addressDetail}
                            <br />
                            {selectedAddress.district}, {selectedAddress.province}, {selectedAddress.postalCode}
                        </p>
                    </div>
                    <button className="change-address-btn" onClick={() => setShowModal(true)}>
                        Change
                    </button>
                </div>
            )}

            {/* Address Modal */}
            {showModal && (
                <div className="address-modal-overlay">
                    <div className="address-modal">
                        <div className="modal-header">
                            <h3>Add Delivery Address</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Address Detail</label>
                                <textarea
                                    name="addressDetail"
                                    value={formData.addressDetail}
                                    onChange={handleInputChange}
                                    placeholder="Enter your address (House no., Street, etc.)"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        placeholder="Enter province"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>District</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        placeholder="Enter district"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Address;
