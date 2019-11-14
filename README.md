# SAFE Network App

Desktop app for managing the your SAFE Network applications.

|                                                                Linux/OS X                                                                 | Windows | Issues |                                                Lines of Code                                                 |
| :---------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :----: | :----------------------------------------------------------------------------------------------------------: |
| [![Build Status](https://travis-ci.com/maidsafe/safe_launchpad_app.svg?branch=master)](https://travis-ci.com/maidsafe/safe_launchpad_app) |         |        | [![LoC](https://tokei.rs/b1/github/maidsafe/safe-network-app)](https://github.com/maidsafe/safe-network-app) |

| [MaidSafe website](https://maidsafe.net) | [SAFE Dev Forum](https://forum.safedev.org) | [SAFE Network Forum](https://safenetforum.org) |
| :--------------------------------------: | :-----------------------------------------: | :--------------------------------------------: |

## Downloading 

Downloading from the GitHub releases page on Linux, using an AppImage will require adding execution permission on some linux dists:

`chmod +x <safe network app>.AppImage`

## Building

-   `git clone`
-   `yarn`
-   `yarn dev`

### Testing

-   `SNAPP_DRY_RUN=true yarn dev`

This will not write to the filesystem, but will log to the console what changes it would have made.

## Releases

-   Fork the SAFE Network App repository
-   Clone repo locally or ensure the latest commit has been pulled if it is already cloned.
-   Before running yarn commands, ensure you remove any local tags and pull all tags from master
-   To install the dependencies run `yarn`.
-   Run `yarn bump --dry-run` to ensure proposed version/changes are correct.
-   Run `yarn bump`
-   We need to push these changes to origin repo, and ensure the changes are merged to master. Push changes AND the tag, for a release via CI.
-   Run `yarn package` to generate packages.

## License

This SAFE Network library is dual-licensed under the Modified BSD ([LICENSE-BSD](LICENSE-BSD) https://opensource.org/licenses/BSD-3-Clause) or the MIT license ([LICENSE-MIT](LICENSE-MIT) https://opensource.org/licenses/MIT) at your option.

## Contribution

Copyrights in the SAFE Network are retained by their contributors. No copyright assignment is required to contribute to this project.
