# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Subtasks breakdown:

1. Support custom Facility ID for Agents.

    Assuming that we're dealing with NoSQL the implementation would be to introduce an array of Facilitator & ID pairs on Agent documents in NoSQL database collection.
    - The new field MAY BE called `facilities`.
    - The field MUST BE optional and MAY BE filled with data when necessary. 
    - The array items are document with two fields, which MAY BE called `facilityId` and `theirId`. Both of those fields MUST BE required.
    - Agent's Facility ID MUST BE immutable, and once it is assigned, it should never change afterwards.
    - Agent MAY HAVE custom Facility ID. Missing ID for particular Facility DOES NOT mean that Agent didn't take any Shifts with that Facility yet. 
    - Agent MUST NOT HAVE more than one Facility ID.

1. Include Agents Facility ID in `getShiftsByFacility` function result.

    Considering the fact that the function already returns some Agent's metadata it must be not a problem to extend it with Agent's custom Facility ID.
    - The result MUST include Agent's metadata which MAY include custom Facility ID. 

1. Support Agents Facility ID in `generateReport` function.

    The report should output custom Agent's Facility ID.
    - Render Agent's Facility ID if it's provided.
    - IF Agent's Facility ID is not provided, fallback to rendering internal Agent's ID.
    - TODO: Discuss with designers and support staff the best way to visually distinct Agent's Facility ID and internal ID rendered in the report.