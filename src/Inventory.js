import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

export const inventory = [];

export const addItemToInventory = (item) => {
  inventory.push(item);
}

export const removeItemFromInventory = (item) => {
  const index = inventory.indexOf(item);
  if (index > -1) {
    inventory.splice(index, 1);
  }
}

// Helper function to group inventory items by name and count them
const groupInventoryItems = (inventory) => {
  const grouped = {};
  
  inventory.forEach(item => {
    const itemName = item.name;
    if (grouped[itemName]) {
      grouped[itemName].count++;
    } else {
      grouped[itemName] = {
        name: itemName,
        count: 1,
        item: item // Keep the original item for any additional properties
      };
    }
  });
  
  return Object.values(grouped);
};

// Animation variants for the bag of holding effect
const bagVariants = {
  closed: {
    scale: 0.8,
    opacity: 0,
    y: 50,
    rotateX: -15,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    rotateY: -10
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    rotateY: 5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const glowVariants = {
  initial: {
    opacity: 0.3,
    scale: 1
  },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pageVariants = {
  enter: {
    opacity: 0,
    x: 20,
    scale: 0.95
  },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const InventoryComponent = (props) => {
  const { inventory = [], closeModal, coins } = props;
  
  // Group inventory items by name
  const groupedItems = groupInventoryItems(inventory);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.min(Math.ceil(groupedItems.length / itemsPerPage), 100);
  
  // Get items for current page
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return groupedItems.slice(startIndex, endIndex);
  };
  
  const currentPageItems = getCurrentPageItems();
  
  // Page navigation functions
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="inventory-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={closeModal}
      >
        <motion.div
          className="inventory-modal-magical"
          variants={bagVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Magical glow effect */}
          <motion.div
            className="magical-glow"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
          
          {/* Header with magical effects */}
          <motion.div
            className="inventory-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className="inventory-title">
              <span className="magical-text">Bag of Holding</span>
              <motion.div
                className="magical-sparkles"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.div>
            </h2>
            <motion.button
              className="inventory-close-magical"
              onClick={closeModal}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              ×
            </motion.button>
          </motion.div>

          {/* Coins display */}
          <motion.div
            className="coins-display-magical"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className="coins-icon">🪙</span>
            <span className="coins-amount">{coins || 0}</span>
          </motion.div>

          {/* Inventory items with pagination */}
          <motion.div
            className="inventory-grid-magical"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {groupedItems.length === 0 ? (
              <motion.div
                className="empty-inventory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="empty-icon">🎒</div>
                <p>Your bag of holding is empty</p>
                <p className="empty-subtitle">Adventure awaits!</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="inventory-page"
                >
                  {currentPageItems.map((groupedItem, index) => (
                    <motion.div
                      key={groupedItem.name}
                      className="inventory-item-magical"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      custom={index}
                      layout
                    >
                      <motion.div
                        className="item-content"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="item-name">
                          {groupedItem.count > 1 ? `${groupedItem.count}x ` : ''}
                          {groupedItem.name}
                        </span>
                        <motion.div
                          className="item-glow"
                          animate={{
                            boxShadow: [
                              "0 0 5px rgba(255, 215, 0, 0.3)",
                              "0 0 15px rgba(255, 215, 0, 0.6)",
                              "0 0 5px rgba(255, 215, 0, 0.3)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Pagination controls */}
          {groupedItems.length > itemsPerPage && (
            <motion.div
              className="inventory-pagination"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.button
                className="pagination-button"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                ‹
              </motion.button>
              
              <div className="pagination-pages">
                {getPageNumbers().map((page, index) => (
                  <motion.button
                    key={index}
                    className={`pagination-page ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    disabled={page === '...'}
                    whileHover={page !== '...' ? { scale: 1.1 } : {}}
                    whileTap={page !== '...' ? { scale: 0.9 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                className="pagination-button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                ›
              </motion.button>
            </motion.div>
          )}

          {/* Page info */}
          {groupedItems.length > 0 && (
            <motion.div
              className="page-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <span className="page-text">
                Page {currentPage} of {totalPages} • {groupedItems.length} unique items
              </span>
            </motion.div>
          )}

          {/* Magical portal effect at bottom */}
          <motion.div
            className="magical-portal"
            animate={{
              background: [
                "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};