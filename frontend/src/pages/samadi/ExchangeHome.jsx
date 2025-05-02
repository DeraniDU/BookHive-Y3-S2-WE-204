import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaDownload, FaImage, FaEnvelope } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ExchangeHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    condition: '',
    search: '',
    available: 'true'
  });
  const [isManager, setIsManager] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    description: '',
    ownerName: '',
    contactInfo: '',
    available: true,
    location: '',
    imageFile: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = { ...filters };
        const response = await axios.get('http://localhost:3000/books', { params });
        setBooks(response.data.data);
        setLoading(false);
        
        // In a real app, you would check the user's role from auth context or API
        setIsManager(true); // Set to true to see the manager features
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to load books. Please try again later.');
      }
    };

    fetchBooks();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/books/${bookToDelete._id}`);
      setBooks(books.filter(book => book._id !== bookToDelete._id));
      toast.success('Book deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete book. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const handleEditClick = (book) => {
    setCurrentBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      description: book.description || '',
      ownerName: book.ownerName,
      contactInfo: book.contactInfo,
      available: book.available,
      location: book.location || '',
      imageFile: null
    });
    setPreviewImage(book.bookImage?.url || null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setEditForm(prev => ({
        ...prev,
        imageFile: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitEdit = async () => {
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(editForm).forEach(key => {
        if (key === 'imageFile' && editForm[key]) {
          formData.append('image', editForm[key]);
        } else if (key !== 'imageFile') {
          formData.append(key, editForm[key]);
        }
      });
  
      // Changed to PUT and corrected endpoint to match backend
      const response = await axios.put(
        `http://localhost:3000/books/${currentBook._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      setBooks(books.map(book =>
        book._id === currentBook._id ? response.data.data : book
      ));
      toast.success('Book updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      console.error('Update error:', err);
      if (err.response) {
        toast.error(`Error: ${err.response.data.message || err.response.statusText}`);
      } else {
        toast.error('Failed to update book. Please try again.');
      }
    }
  };

  const generatePDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
  
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
  
      // Add logo or header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(40, 53, 147);
      doc.text('Book Exchange', 105, 20, { align: 'center' });
      
      // Report title
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Available Books Catalog', 105, 30, { align: 'center' });
      
      // Report details
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 40);
      doc.text(`Total Books: ${books.length}`, 15, 45);
      doc.text(`Filters: ${filters.genre || 'All Genres'}, ${filters.condition || 'All Conditions'}`, 15, 50);
  
      // Prepare detailed table data
      const tableData = books.map((book, index) => [
        index + 1, // Serial number
        book.title || 'N/A',
        book.author || 'N/A',
        book.genre || 'N/A',
        book.condition || 'N/A',
        book.ownerName || 'N/A',
        book.contactInfo || 'N/A',
        book.available ? 'Yes' : 'No',
        book.location || 'N/A'
      ]);
  
      // Generate table with enhanced styling
      doc.autoTable({
        head: [
          ['#', 'Title', 'Author', 'Genre', 'Condition', 'Owner', 'Contact', 'Available', 'Location']
        ],
        body: tableData,
        startY: 60,
        margin: { top: 60 },
        styles: {
          fontSize: 8,
          cellPadding: 1.5,
          overflow: 'linebreak',
          valign: 'middle',
          halign: 'left'
        },
        headStyles: {
          fillColor: [13, 71, 161],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },  // Serial number
          1: { cellWidth: 30 },  // Title
          2: { cellWidth: 25 },  // Author
          3: { cellWidth: 20 },  // Genre
          4: { cellWidth: 15 },  // Condition
          5: { cellWidth: 20 },  // Owner
          6: { cellWidth: 25 },  // Contact
          7: { cellWidth: 15 },  // Available
          8: { cellWidth: 20 }   // Location
        },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageNumber}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      });
  
      // Add watermark
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.setGState(new doc.GState({ opacity: 0.1 }));
      doc.text('Book Exchange', 105, 150, { angle: 45, align: 'center' });
  
      doc.save(`Book_Exchange_Catalog_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success('PDF catalog generated successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: 'red'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />

      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
      }}>
        {/* Add Book Button (visible only to managers) */}
        {isManager && (
          <button
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 1000,
              transition: 'all 0.3s ease',
            }}
            onClick={() => navigate('/exchange/add')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            }}
          >
            <FaPlus />
          </button>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Confirm Deletion</h3>
              <p>Are you sure you want to delete the book "{bookToDelete.title}" by {bookToDelete.author}?</p>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>This action cannot be undone.</p>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px',
                marginTop: '25px'
              }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ marginTop: 0, color: '#3498db' }}>Edit Book Details</h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Author*</label>
                  <input
                    type="text"
                    name="author"
                    value={editForm.author}
                    onChange={handleEditChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Genre*</label>
                  <select
                    name="genre"
                    value={editForm.genre}
                    onChange={handleEditChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="">Select Genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Biography">Biography</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Condition*</label>
                  <select
                    name="condition"
                    value={editForm.condition}
                    onChange={handleEditChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Worn">Worn</option>
                    <option value="Used">Used</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Owner Name*</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={editForm.ownerName}
                    onChange={handleEditChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contact Info*</label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={editForm.contactInfo}
                    onChange={handleEditChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Available</label>
                  <select
                    name="available"
                    value={editForm.available}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      available: e.target.value === 'true'
                    }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Book Image</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    {previewImage && (
                      <img 
                        src={previewImage} 
                        alt="Book preview" 
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    )}
                    <label style={{
                      display: 'inline-block',
                      padding: '8px 15px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}>
                      <FaImage /> Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      Max 5MB (JPEG, PNG)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px',
                marginTop: '15px'
              }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={submitEdit}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FaCheck /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h1 style={{ margin: 0 }}>Book Exchange Platform</h1>
          <p style={{ margin: '10px 0 0' }}>Find and exchange books with your community</p>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Available Books</h2>
          <button
            onClick={generatePDF}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px'
            }}
          >
            <FaDownload /> Download PDF
          </button>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>Search by Title/Author</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search books..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div style={{ minWidth: '200px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>Genre</label>
              <select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">All Genres</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Biography">Biography</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
              </select>
            </div>

            <div style={{ minWidth: '200px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>Condition</label>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Worn">Worn</option>
                <option value="Used">Used</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>

            <div style={{ minWidth: '200px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>Availability</label>
              <select
                name="available"
                value={filters.available}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
                <option value="">All</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px'
          }}>
            <p>Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h3>No books available matching your criteria</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {books.map(book => (
              <div key={book._id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                {/* Book Image */}
                {book.bookImage?.url && (
                  <div style={{
                    height: '200px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={book.bookImage.url} 
                      alt={book.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}

                <div style={{
                  padding: '15px'
                }}>
                  <h3 style={{
                    margin: '0 0 10px',
                    color: '#2c3e50',
                    fontSize: '18px'
                  }}>{book.title}</h3>
                  <p style={{
                    margin: '0 0 15px',
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}>by {book.author}</p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }}>
                    <span style={{
                      backgroundColor: '#e8f4f8',
                      color: '#3498db',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>{book.genre}</span>
                    <span style={{
                      backgroundColor: '#e8f5e9',
                      color: book.available ? '#27ae60' : '#e74c3c',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {book.available ? 'Available' : 'Not Available'}
                    </span>
                    <span style={{
                      backgroundColor: '#fef5e7',
                      color: '#e67e22',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>{book.condition}</span>
                  </div>

                  {book.description && (
                    <p style={{
                      color: '#34495e',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      margin: '0 0 15px'
                    }}>
                      {book.description.length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : book.description}
                    </p>
                  )}

                  <div style={{ marginTop: '15px' }}>
                    <p style={{
                      margin: '5px 0',
                      fontSize: '13px',
                      color: '#7f8c8d'
                    }}>
                      <strong>Owner:</strong> {book.ownerName}
                    </p>
                    <p style={{
                      margin: '5px 0',
                      fontSize: '13px',
                      color: '#7f8c8d'
                    }}>
                      <strong>Contact:</strong> {book.contactInfo}
                    </p>
                    <p style={{
                      margin: '5px 0',
                      fontSize: '13px',
                      color: '#7f8c8d'
                    }}>
                      <strong>Location:</strong> {book.location || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '10px 15px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <a href={`mailto:${book.contactInfo}`} style={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <FaEnvelope /> Contact
                    </a>

                    {isManager && (
                      <>
                        <button
                          onClick={() => handleEditClick(book)}
                          style={{
                            backgroundColor: '#f39c12',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '14px'
                          }}
                          title="Edit book"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book)}
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '14px'
                          }}
                          title="Delete book"
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#7f8c8d'
                  }}>
                    {new Date(book.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ExchangeHome;