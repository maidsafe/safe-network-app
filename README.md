# Safe Network App

Desktop app for managing the your Safe Network applications.

|                                                                Linux/OS X                                                                 | Windows | Issues |                                                Lines of Code                                                 |
| :---------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :----: | :----------------------------------------------------------------------------------------------------------: |
| [![Build Status](https://travis-ci.com/maidsafe/safe_launchpad_app.svg?branch=master)](https://travis-ci.com/maidsafe/safe_launchpad_app) |         |        | [![LoC](https://tokei.rs/b1/github/maidsafe/sn_app)](https://github.com/maidsafe/sn_app) |

| [MaidSafe website](https://maidsafe.net) | [Safe Dev Forum](https://forum.safedev.org) | [Safe Network Forum](https://safenetforum.org) |
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

-   Fork the Safe Network App repository
-   Clone repo locally or ensure the latest commit has been pulled if it is already cloned.
-   Before running yarn commands, ensure you remove any local tags and pull all tags from master
-   To install the dependencies run `yarn`.
-   Run `yarn bump --dry-run` to ensure proposed version/changes are correct.
-   Run `yarn bump`
-   We need to push these changes to origin repo, and ensure the changes are merged to master. Push changes AND the tag, for a release via CI.
-   Run `yarn package` to generate packages.

## License

This Safe Network library is dual-licensed under the Modified BSD ([LICENSE-BSD](LICENSE-BSD) https://opensource.org/licenses/BSD-3-Clause) or the MIT license ([LICENSE-MIT](LICENSE-MIT) https://opensource.org/licenses/MIT) at your option.

## Contributing

Want to contribute? Great :tada:

There are many ways to give back to the project, whether it be writing new code, fixing bugs, or just reporting errors. All forms of contributions are encouraged!

For instructions on how to contribute, see our [Guide to contributing](https://github.com/maidsafe/QA/blob/master/CONTRIBUTING.md).
