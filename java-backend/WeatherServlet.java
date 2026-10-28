package com.tyagiforecast;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.xml.parsers.*;
import org.w3c.dom.*;

public class WeatherServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String requestedCity = request.getParameter("city");
        if (requestedCity == null || requestedCity.isEmpty()) {
            requestedCity = "Ghaziabad";
        }

        // Mock model dispatching XML telemetry to JSP presentation
        request.setAttribute("city", requestedCity);
        request.setAttribute("temperature", "26°C");
        request.setAttribute("humidity", "62%");
        request.setAttribute("wind", "11 km/h");
        request.setAttribute("aqi", "142");
        request.setAttribute("aqiStatus", "Moderate");

        RequestDispatcher dispatcher = request.getRequestDispatcher("/forecastView.jsp");
        dispatcher.forward(request, response);
    }
}