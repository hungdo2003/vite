package com.swp391team3.koi_delivery_ordering_system.utils;

public class Utilities {
    private static final double R = 6371.0;
    private static final int CODE_LENGTH = 6; // Total length of numeric part

    public static boolean compareCountry(String address1, String address2) {
        if (address1.equalsIgnoreCase(address2)) {
            return true;
        } else {
            return false;
        }
    }

    public static String generateOrderCode(String prefix, Long orderId) {
        return prefix + String.format("%0" + CODE_LENGTH + "d", orderId);
    }

    // Method to calculate distance between two lat/long points using Haversine formula
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Convert latitude and longitude from degrees to radians
        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        // Haversine formula
        double dlat = lat2Rad - lat1Rad;
        double dlon = lon2Rad - lon1Rad;

        double a = Math.sin(dlat / 2) * Math.sin(dlat / 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * Math.sin(dlon / 2) * Math.sin(dlon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double result = R * c;
        // Calculate the distance
        return result;
    }
}
