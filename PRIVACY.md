# Flow privacy

Flow is designed so private cycle tracking does not need to be stored by the project.

## What Flow stores

In the current MVP, tracking information is stored in the browser's local IndexedDB database on the device using Flow. This includes profile setup, period logs, symptoms, notes and settings.

## What Flow does not do

The MVP does not create an account for the tracker, send private tracking data to a Flow server, run advertising trackers, or use private health data for analytics or advertising.

## Backups

Exported backups are files under the user's control. Flow does not receive or store those files. Future backup integrations should transfer encrypted backup data directly to a storage destination selected by the user.

Local browser storage can be cleared by the browser, device management, private browsing settings, user action or storage pressure. Export a backup if the information is important.

## Public features

Knowledge resources link to external publishers. Community and professional-directory features, when implemented, will be separate public services. They should never be connected to a user's private tracking database.

Anonymous community participation does not mean that every network or hosting layer is incapable of seeing technical metadata. The project will minimize logs and document any infrastructure that necessarily handles public submissions before launch.

## Medical information

Flow is a tracking and information utility. It does not diagnose, treat or replace professional medical care. Predictions are estimates based on recorded history.

## Changes

This document will be updated when the architecture changes. Any future feature that requires transmitting private health information will be treated as a material privacy change and documented before implementation.
