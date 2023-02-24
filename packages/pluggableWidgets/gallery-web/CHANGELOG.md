# Changelog

All notable changes to this widget will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   A new property - "Selection". This property controls item selection.

-   A new property - "On selection change". When selection enabled, this property allow you to specify a microflow or a nanoflow that will be called with selected item(s) as a parameter.

### Changed

-   We renamed some properties to improve Page Explorere view for gallery.

-   We changed condition for gallery header. Now header dropzone visible when you enabled selection.

## [1.2.0] - 2022-06-13

### Fixed

-   We removed "widget-gallery-filter" element from DOM if no filters has been provided.

## [1.1.0] - 2021-12-23

### Added

-   We added dark mode to Structure mode preview.

-   We added dark icons for Tile and List view.

## [1.0.3] - 2021-11-16

### Fixed

-   We fixed an issue causing a content inside rows to be re-rendered while using filtering.

## [1.0.2] - 2021-10-13

### Changed

-   We made the "Enable advanced options" available only for Studio users, keeping all the advanced features available by default in Studio Pro.

## [1.0.1] - 2021-10-07

### Changed

-   We added a check to prevent actions to be triggered while being executed

## [1.0.0] - 2021-09-28

### Added

-   Added multiple filtering options

-   Added responsiveness for Desktop, Tablet and Phones

-   Added possibility to reuse filters from Data Grid.
