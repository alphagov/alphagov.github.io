"Tools over content" was written boldly of the wall of the dingy room where we built Alpha.gov.uk. It was one of our original design rules and has probably guided our technical architecture more than any other principle.

In a sense it was a reflection of one of the other alpha design principles: "get to the do." Most users who come to a government website are looking to complete a specific task, not research an abstract topic. In architectural terms we took it to mean that focussed custom tools should be first-class citizens of the website, not secondary to written content or shoe-horned into a system primarily designed for content management.

In common with general good practice for designing secure systems of this kind we've also split our front (end user facing) and backend systems as cleanly as possible. The apps can generally be considered in three clusters: routing, frontend and backend.

For now we're going to cover the pieces in broad strokes, and I'll follow up by showing how to get smart answers up and running.

## Routing

The routing component is concerned with making the whole system feel like a single website. It takes a request for a given URL and dispatches it to the correct frontend application. We've experimented with a few approaches to this, and currently use a generated varnish configuration.

## Frontend

This is where the "tools over content" mantra is most clearly seen. There are a series of applications that provide the frontend, currently: frontend (yes, it could be better named), smart answers, licence finder, trade tariff front end, business support finder, and whitehall. Over time this will grow.

All of these apps are dependent on the 'static' application which provides their templates and important assets (stylesheets, etc), and on the "content API" to retrieve metadata about their place in the system.

Frontend is also dependent on the content API for the written content it displays. Some formats within frontend also need the "imminence" or "rummager" services, though these are proxied through the content API. Trade Tariff front end, business support finder and whitehall have their own dependencies.

## Backend

When setting out to build our backend applications we wanted to achieve two things:
* Provide our users with a clear, focussed experience to complete their tasks (just as with our fronted approach)
* Maintain the understanding that custom tools are first class citizens on GOV.UK by providing a clear way to integrate them

In understanding the configuration it's worth being aware that we currently manage GOV.UK as two discrete chunks: Mainstream & Detailed Guidance and Inside Government. We're working on bringing these two segments together but for now they work quite differently.

The key pieces are:
* Panopticon - this is the hub of the mainstream system and provides the "tools over content" glue. All content for GOV.UK is registered with Panopticon, which then takes care of annotating content with metadata (categorisation, etc) and registering it in the search engine via the Rummager application.
* Publisher - all written mainstream content is managed via Publisher. It provides a simple workflow system and an email-based mechanism for sending items for fact checking by departments. Publisher requests data from Panopticon when a new item is created, and informs Panopticon when content is published. Publisher and Panopticon share an underlying database, and a set of model code via the [`govuk_content_models`](https://github.com/alphagov/govuk_content_models) gem.
* Imminence - started life as a way to manage geographic data sets. It is gradually expanding to manage other data sets such as those for the Business Support Finder.
* Whitehall - The Whitehall application is deployed twice, once as a fronted application and once in the backend. In the backend context it's used to manage all the content for Detailed Guidance and Inside Government. It submits its content to search via the Rummager application
* Rummager - a wrapper around our backend search service (currently elasticsearch, previously Solr). Rummager provides configuration for our search indexes and an API for pushing items into search and running queries.
