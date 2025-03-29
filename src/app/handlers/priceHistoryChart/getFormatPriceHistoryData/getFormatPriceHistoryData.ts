export function getFormatPriceHistoryData(
  priceHistory: { price: number; createdAt: Date }[],
  period: string
) {
  if (period === "day") {
    const hourlyData = priceHistory.filter((entry) => {
      const dateObj = new Date(entry.createdAt);
      return dateObj.getMinutes() === 0; // Only include entries at the start of the hour
    });

    const labels = hourlyData.map((entry) =>
      new Date(entry.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
    const data = hourlyData.map((entry) => entry.price);
    return { labels, data };
  } else if (period === "week") {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7); // Get the date for 7 days ago

    const groupedData = priceHistory.reduce(
      (acc: Record<string, { price: number; dateObj: Date }>, entry) => {
        const dateObj = new Date(entry.createdAt);
        const dateKey = dateObj.toISOString().split("T")[0]; // format: "2024-02-13"

        // Only consider entries from the last 7 days
        if (dateObj >= lastWeek && dateObj <= today) {
          if (!acc[dateKey] || entry.price > acc[dateKey].price) {
            acc[dateKey] = { price: entry.price, dateObj };
          }
        }

        return acc;
      },
      {}
    );

    const labels: string[] = [];
    const data: number[] = [];

    // Create an array of the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split("T")[0]; // format: "2024-02-13"
      const priceData = groupedData[dateKey];

      labels.push(date.toLocaleDateString("en-US", {
        weekday: "short", // Use short weekday names
      }));      
      data.push(priceData ? priceData.price : 0); // Use 0 if no data for that day
    }

    return { data, labels };
  } else if (period === "month") {
    const groupedData = priceHistory.reduce(
      (acc: Record<string, { price: number; dateObj: Date }>, entry) => {
        const dateObj = new Date(entry.createdAt);
        const dateKey = dateObj.toISOString().split("T")[0]; // format: "2024-02-13"

        if (!acc[dateKey] || entry.price > acc[dateKey].price) {
          acc[dateKey] = { price: entry.price, dateObj };
        }

        return acc;
      },
      {}
    );
    const labels = Object.values(groupedData).map(({ dateObj }) =>
      dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );
    const data = Object.values(groupedData).map(({ price }) => price);
    return { data, labels };
  } else {
    const groupedData = priceHistory.reduce(
      (acc: Record<string, { price: number; dateObj: Date }>, entry) => {
        const dateObj = new Date(entry.createdAt);
        // Calculate the week number for the entry
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const weekNumber = Math.floor(dateObj.getDate() / 7); // This gives us the week number within the month

        // Use the week number to group the data
        const key = `${year}-${month + 1}-${weekNumber}`; // e.g., "2024-2-3" (Year-Month-Week)

        if (!acc[key] || entry.price > acc[key].price) {
          acc[key] = { price: entry.price, dateObj };
        }

        return acc;
      },
      {}
    );
    const labels = Object.values(groupedData).map(({ dateObj }) =>
      dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );
    const data = Object.values(groupedData).map(({ price }) => price);
    return { data, labels };
  }
}
