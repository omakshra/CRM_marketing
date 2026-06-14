import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AudienceContext = createContext(null);

export function AudienceProvider({ children }) {
  const [segmentResult, setSegmentResult] = useState(null);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const toggleCustomerSelection = useCallback((customerId) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    );
  }, []);

  const selectAllCustomers = useCallback((customerIds) => {
    setSelectedCustomerIds(customerIds);
  }, []);

  const toggleSelectAllCustomers = useCallback((customerIds) => {
    setSelectedCustomerIds((prev) => {
      const allSelected = customerIds.length > 0 && customerIds.every((id) => prev.includes(id));
      return allSelected ? [] : customerIds;
    });
  }, []);

  const value = useMemo(
    () => ({
      segmentResult,
      setSegmentResult,
      selectedCustomerIds,
      setSelectedCustomerIds,
      toggleCustomerSelection,
      selectAllCustomers,
      toggleSelectAllCustomers,
    }),
    [segmentResult, selectedCustomerIds, toggleCustomerSelection, selectAllCustomers, toggleSelectAllCustomers],
  );

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience() {
  const context = useContext(AudienceContext);
  if (!context) {
    throw new Error('useAudience must be used within AudienceProvider');
  }
  return context;
}
