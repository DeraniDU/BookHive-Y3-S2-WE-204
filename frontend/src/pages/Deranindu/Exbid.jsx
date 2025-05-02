// Exbid.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getBids } from "../../api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Exbid.css";

const Exbid = () => {
  const navigate = useNavigate();
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "active", "not-started", "expired"
  const [selectedBids, setSelectedBids] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("endDate"); // Default sort by end date
  const [sortOrder, setSortOrder] = useState("desc"); // Default descending order

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await getBids();
        setBidData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError("Failed to load bids. Please try again.");
        setLoading(false);
      }
    };
    
    fetchBids();
  }, []);

  // Filter bids based on status and search query
  const getFilteredBids = () => {
    return bidData
      .filter(bid => {
        // Filter by status
        if (filter !== "all" && bid.status.toLowerCase().replace(' ', '-') !== filter) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          return (
            bid.bookListing.name.toLowerCase().includes(query) ||
            bid.bookListing.author.toLowerCase().includes(query) ||
            bid.bookListing.category.toLowerCase().includes(query) ||
            bid.location.toLowerCase().includes(query)
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        // Handle sorting
        let valueA, valueB;
        
        switch (sortBy) {
          case "bookName":
            valueA = a.bookListing.name.toLowerCase();
            valueB = b.bookListing.name.toLowerCase();
            break;
          case "author":
            valueA = a.bookListing.author.toLowerCase();
            valueB = b.bookListing.author.toLowerCase();
            break;
          case "startDate":
            valueA = new Date(a.startDate || 0).getTime();
            valueB = new Date(b.startDate || 0).getTime();
            break;
          case "endDate":
            valueA = new Date(a.endDate || 0).getTime();
            valueB = new Date(b.endDate || 0).getTime();
            break;
          case "bidCount":
            valueA = a.bids.length;
            valueB = b.bids.length;
            break;
          case "highestBid":
            valueA = getHighestBidAmountValue(a.bids);
            valueB = getHighestBidAmountValue(b.bids);
            break;
          default:
            valueA = new Date(a.endDate || 0).getTime();
            valueB = new Date(b.endDate || 0).getTime();
        }
        
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
  };

  const filteredBids = getFilteredBids();

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to descending
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Toggle bid selection for PDF generation
  const toggleBidSelection = (bidId) => {
    setSelectedBids(prevSelected => {
      if (prevSelected.includes(bidId)) {
        return prevSelected.filter(id => id !== bidId);
      } else {
        return [...prevSelected, bidId];
      }
    });
  };

  // Select all bids
  const selectAllBids = () => {
    if (selectedBids.length === filteredBids.length) {
      // Deselect all if all are selected
      setSelectedBids([]);
    } else {
      // Select all filtered bids
      setSelectedBids(filteredBids.map(bid => bid._id));
    }
  };

  // View bid details
  const handleViewBid = (bidId) => {
    navigate(`/bidding-success?bidId=${bidId}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get highest bid amount for a bid (for display)
  const getHighestBidAmount = (bids) => {
    if (!bids || bids.length === 0) return "No bids yet";
    const highestBid = bids.reduce((prev, current) => {
      return (prev.amount > current.amount) ? prev : current;
    }, { amount: 0 });
    return `$${highestBid.amount.toFixed(2)}`;
  };

  // Get highest bid amount value (for sorting)
  const getHighestBidAmountValue = (bids) => {
    if (!bids || bids.length === 0) return 0;
    const highestBid = bids.reduce((prev, current) => {
      return (prev.amount > current.amount) ? prev : current;
    }, { amount: 0 });
    return highestBid.amount;
  };

  // Generate PDF report of selected bids
  const generatePDF = () => {
    // If no bids are selected, use all filtered bids
    const bidsToInclude = selectedBids.length > 0 
      ? filteredBids.filter(bid => selectedBids.includes(bid._id))
      : filteredBids;
    
    if (bidsToInclude.length === 0) {
      alert("No bids selected for the report.");
      return;
    }
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add document title
    doc.setFontSize(20);
    doc.text("Book Bidding Report", 105, 15, { align: "center" });
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: "center" });
    
    // Add filter information
    doc.setFontSize(12);
    doc.text(`Filter: ${filter === "all" ? "All Bids" : filter.replace("-", " ")}`, 14, 30);
    if (searchQuery) {
      doc.text(`Search: "${searchQuery}"`, 14, 36);
    }
    
    // Define table columns
    const tableColumn = [
      "Book Title", 
      "Author", 
      "Category", 
      "Start Date", 
      "End Date", 
      "Location", 
      "Bids",
      "Highest Bid"
    ];
    
    // Define table rows
    const tableRows = bidsToInclude.map(bid => [
      bid.bookListing.name,
      bid.bookListing.author,
      bid.bookListing.category,
      formatDate(bid.startDate),
      formatDate(bid.endDate),
      bid.location,
      bid.bids.length,
      getHighestBidAmount(bid.bids)
    ]);
    
    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: searchQuery ? 42 : 36,
      theme: "grid",
      headStyles: {
        fillColor: [28, 61, 90],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 40 },
      styles: { overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 35 }, // Book title
        1: { cellWidth: 25 }, // Author
        2: { cellWidth: 20 }, // Category
        3: { cellWidth: 20 }, // Start Date
        4: { cellWidth: 20 }, // End Date
        5: { cellWidth: 25 }, // Location
        6: { cellWidth: 15 }, // Bids
        7: { cellWidth: 20 }  // Highest Bid
      }
    });
    
    // Add summary section
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.text("Summary:", 14, finalY + 10);
    doc.text(`Total number of bids: ${bidsToInclude.length}`, 14, finalY + 18);
    
    // Calculate the average highest bid
    const validBids = bidsToInclude.filter(bid => bid.bids && bid.bids.length > 0);
    if (validBids.length > 0) {
      const totalHighestBids = validBids.reduce((sum, bid) => {
        const highestBid = bid.bids.reduce((prev, current) => {
          return (prev.amount > current.amount) ? prev : current;
        }, { amount: 0 });
        return sum + highestBid.amount;
      }, 0);
      const averageHighestBid = totalHighestBids / validBids.length;
      doc.text(`Average highest bid: $${averageHighestBid.toFixed(2)}`, 14, finalY + 26);
    }
    
    // Save the PDF
    doc.save("book-bidding-report.pdf");
  };

  // Generate detailed PDF for a single bid
  const generateSingleBidPDF = (bid) => {
    const doc = new jsPDF();
    
    // Add document title
    doc.setFontSize(20);
    doc.text(`Bid Details: ${bid.bookListing.name}`, 105, 15, { align: "center" });
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: "center" });
    
    // Add book information
    doc.setFontSize(14);
    doc.text("Book Information", 14, 35);
    doc.setFontSize(12);
    doc.text(`Title: ${bid.bookListing.name}`, 14, 45);
    doc.text(`Author: ${bid.bookListing.author}`, 14, 53);
    doc.text(`Category: ${bid.bookListing.category}`, 14, 61);
    doc.text(`Publisher: ${bid.bookListing.publisher || "Not available"}`, 14, 69);
    doc.text(`ISBN: ${bid.bookListing.isbn || "Not available"}`, 14, 77);
    
    // Add bid information
    doc.setFontSize(14);
    doc.text("Bid Information", 14, 90);
    doc.setFontSize(12);
    doc.text(`Status: ${bid.status}`, 14, 100);
    doc.text(`Start Date: ${formatDate(bid.startDate)}`, 14, 108);
    doc.text(`End Date: ${formatDate(bid.endDate)}`, 14, 116);
    doc.text(`Location: ${bid.location}`, 14, 124);
    doc.text(`Total Bids: ${bid.bids.length}`, 14, 132);
    doc.text(`Highest Bid: ${getHighestBidAmount(bid.bids)}`, 14, 140);
    
    // Add bid history if available
    if (bid.bids && bid.bids.length > 0) {
      doc.setFontSize(14);
      doc.text("Bid History", 14, 155);
      
      // Sort bids by amount (highest to lowest)
      const sortedBids = [...bid.bids].sort((a, b) => b.amount - a.amount);
      
      // Create table for bid history
      const bidHistoryColumns = ["Bidder", "Amount", "Date"];
      const bidHistoryRows = sortedBids.map(bidItem => [
        bidItem.bidder ? bidItem.bidder.username : "Anonymous",
        `$${bidItem.amount.toFixed(2)}`,
        new Date(bidItem.createdAt).toLocaleString()
      ]);
      
      doc.autoTable({
        head: [bidHistoryColumns],
        body: bidHistoryRows,
        startY: 160,
        theme: "grid",
        headStyles: {
          fillColor: [28, 61, 90],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
    }
    
    // Save the PDF
    doc.save(`bid-details-${bid._id}.pdf`);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="exbid-container">
          <div className="loading-spinner">Loading bids...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="exbid-container">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigate('/')}>Go Back</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="exbid-container">
        <div className="exbid-header">
          <h2>All Bids</h2>
          
          <div className="search-filter-container">
            {/* Search input */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by book, author, category or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            
            {/* Filter dropdown */}
            <div className="filter-container">
              <label htmlFor="filter">Filter by status:</label>
              <select id="filter" value={filter} onChange={handleFilterChange}>
                <option value="all">All Bids</option>
                <option value="active">Active</option>
                <option value="not-started">Not Started</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
          
          {/* PDF Controls */}
          <div className="report-controls">
            <div className="selection-controls">
              <label>
                <input
                  type="checkbox"
                  checked={selectedBids.length === filteredBids.length && filteredBids.length > 0}
                  onChange={selectAllBids}
                />
                Select All
              </label>
              <span className="selected-count">
                {selectedBids.length} of {filteredBids.length} selected
              </span>
            </div>
            
            <button 
              className="btn-generate-pdf"
              onClick={generatePDF}
              disabled={filteredBids.length === 0}
            >
              Generate PDF Report
            </button>
          </div>
          
          {/* Sort controls */}
          <div className="sort-controls">
            <span>Sort by:</span>
            <button 
              className={`sort-button ${sortBy === "bookName" ? "active" : ""}`}
              onClick={() => handleSortChange("bookName")}
            >
              Book Name {sortBy === "bookName" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button 
              className={`sort-button ${sortBy === "endDate" ? "active" : ""}`}
              onClick={() => handleSortChange("endDate")}
            >
              End Date {sortBy === "endDate" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button 
              className={`sort-button ${sortBy === "bidCount" ? "active" : ""}`}
              onClick={() => handleSortChange("bidCount")}
            >
              Bid Count {sortBy === "bidCount" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button 
              className={`sort-button ${sortBy === "highestBid" ? "active" : ""}`}
              onClick={() => handleSortChange("highestBid")}
            >
              Highest Bid {sortBy === "highestBid" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>

        {filteredBids.length > 0 ? (
          <div className="bid-cards-container">
            {filteredBids.map((bid) => (
              <div key={bid._id} className={`bid-card ${bid.status.toLowerCase().replace(' ', '-')}`}>
                <div className="bid-selection">
                  <input
                    type="checkbox"
                    checked={selectedBids.includes(bid._id)}
                    onChange={() => toggleBidSelection(bid._id)}
                  />
                </div>
                <div className="bid-card-header">
                  <h3>{bid.bookListing.name}</h3>
                  <span className={`bid-status ${bid.status.toLowerCase().replace(' ', '-')}`}>
                    {bid.status}
                  </span>
                </div>
                <div className="bid-card-content">
                  <p><strong>Author:</strong> {bid.bookListing.author}</p>
                  <p><strong>Category:</strong> {bid.bookListing.category}</p>
                  <p><strong>Start Date:</strong> {formatDate(bid.startDate)}</p>
                  <p><strong>End Date:</strong> {formatDate(bid.endDate)}</p>
                  <p><strong>Location:</strong> {bid.location}</p>
                  <p><strong>Total Bids:</strong> {bid.bids.length}</p>
                  <p><strong>Highest Bid:</strong> {getHighestBidAmount(bid.bids)}</p>
                </div>
                <div className="bid-card-actions">
                  <button className="btn-primary" onClick={() => handleViewBid(bid._id)}>
                    View Details
                  </button>
                  <button className="btn-secondary" onClick={() => generateSingleBidPDF(bid)}>
                    Export PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bids-message">
            <p>No bids found with the selected filter.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Exbid;