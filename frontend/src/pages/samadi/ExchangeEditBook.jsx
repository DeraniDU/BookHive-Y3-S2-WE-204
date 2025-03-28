import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// Validation Schema using Yup
const validationSchema = Yup.object({
  bookTitle: Yup.string().required("Book title is required"),
  bookGenre: Yup.string().required("Book genre is required"),
  condition: Yup.string().required("Please select the book condition"),
  exchangeBook: Yup.string().required("Book to exchange is required"),
  availableDate: Yup.date().required("Available date is required").min(new Date(), "Available date cannot be in the past"),
  comments: Yup.string().optional(),
  bookImage: Yup.mixed().nullable().test("fileType", "Only image files are allowed", value => {
    return !value || (value && value[0] && value[0].type.startsWith("image"));
  })
});

const ExchangeEditBook = ({ initialBookData = {}, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialBookData,
  });

  // Handle form submission
  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  useEffect(() => {
    // Set initial data if available
    if (initialBookData) {
      setValue("bookTitle", initialBookData.bookTitle || "");
      setValue("bookGenre", initialBookData.bookGenre || "");
      setValue("condition", initialBookData.condition || "");
      setValue("exchangeBook", initialBookData.exchangeBook || "");
      setValue("availableDate", initialBookData.availableDate || "");
      setValue("comments", initialBookData.comments || "");
    }
  }, [initialBookData, setValue]);

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>Edit Book Details</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="bookTitle" style={styles.label}>Book Title</label>
            <input
              type="text"
              id="bookTitle"
              {...register("bookTitle")}
              placeholder="Enter book title"
              style={styles.input}
            />
            {errors.bookTitle && <span style={styles.error}>{errors.bookTitle.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="bookGenre" style={styles.label}>Book Genre</label>
            <input
              type="text"
              id="bookGenre"
              {...register("bookGenre")}
              placeholder="Enter book genre"
              style={styles.input}
            />
            {errors.bookGenre && <span style={styles.error}>{errors.bookGenre.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="condition" style={styles.label}>Condition</label>
            <select
              id="condition"
              {...register("condition")}
              style={styles.select}
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
            {errors.condition && <span style={styles.error}>{errors.condition.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="exchangeBook" style={styles.label}>Book to Exchange</label>
            <input
              type="text"
              id="exchangeBook"
              {...register("exchangeBook")}
              placeholder="Enter book for exchange"
              style={styles.input}
            />
            {errors.exchangeBook && <span style={styles.error}>{errors.exchangeBook.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="availableDate" style={styles.label}>Available Date</label>
            <input
              type="date"
              id="availableDate"
              {...register("availableDate")}
              style={styles.input}
            />
            {errors.availableDate && <span style={styles.error}>{errors.availableDate.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="comments" style={styles.label}>Comments</label>
            <textarea
              id="comments"
              {...register("comments")}
              placeholder="Any additional comments?"
              style={styles.textarea}
            />
            {errors.comments && <span style={styles.error}>{errors.comments.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="bookImage" style={styles.label}>Book Image</label>
            <input
              type="file"
              id="bookImage"
              {...register("bookImage")}
              accept="image/*"
              style={styles.input}
            />
            {errors.bookImage && <span style={styles.error}>{errors.bookImage.message}</span>}
          </div>

          <button type="submit" style={styles.submitBtn}>Save Changes</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

const ParentComponent = () => {
  const [bookData, setBookData] = useState({
    bookTitle: 'Atomic Habits',
    bookGenre: 'Personal Development',
    condition: 'New',
    exchangeBook: 'Rich Dad Poor Dad',
    availableDate: '2025-04-01',
    comments: 'Great condition',
    bookImage: null,
  });

  const handleBookDataSubmit = (updatedBookData) => {
    console.log('Updated Book Data:', updatedBookData);
    setBookData(updatedBookData); // Update the state with the new data
  };

  return (
    <div>
      <ExchangeEditBook initialBookData={bookData} onSubmit={handleBookDataSubmit} />
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
    height: '100px',
  },
  submitBtn: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
};

export default ParentComponent;
