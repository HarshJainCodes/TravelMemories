import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const appInsights = new ApplicationInsights({
    config: {
        connectionString: import.meta.env.VITE_APPLICATION_INSIGHTS_CONN_STRING,
    }
})

appInsights.loadAppInsights();
appInsights.trackPageView(); // Record the first page load

export default appInsights;
