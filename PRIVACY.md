# Ritmi privacy

Ritmi is designed so private cycle tracking does not need to be stored by the project.

## What Ritmi stores

Tracking information is stored in the browser's local IndexedDB database on the device using Ritmi. This includes profile setup, period logs, symptoms, notes and settings.

## What Ritmi does not do

The private tracker does not require an account, send private tracking data to a Ritmi health server, run advertising trackers, or use private health data for analytics or advertising.

## Backups

Exported backups are files under the user's control. Ritmi does not receive or store those files. Encrypted backup/share payloads are generated in the browser. Any future remote backup integration must transfer encrypted data directly to a storage destination selected by the user.

Local browser storage can be cleared by the browser, device management, private browsing settings, user action or storage pressure. Export a backup if the information is important.

## Public features

Knowledge resources link to external publishers. Community and professional-directory features are separate public layers and must never be connected to a user's private tracking database.

Anonymous community participation does not mean that every network or hosting layer is incapable of seeing technical metadata. The project will minimize logs and document any infrastructure that necessarily handles public submissions before launch.

## Medical information

Ritmi is a tracking and information utility. It does not diagnose, treat or replace professional medical care. Estimates are based on recorded history and baseline settings and are not medical certainty.

## Changes

This document will be updated when the architecture changes. Any future feature that requires transmitting private health information will be treated as a material privacy change and documented before implementation.
