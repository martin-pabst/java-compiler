# Treeview-component
  * first use: display AST when debugging compiler
  * later: replace old `accordion`-component in Online-IDE and SQL-IDE

## Ideas
  * Each entry holds a reference to an outside object
  * entry display:
 | | | <Icon> Entry-Name        (right-aligned Info   )<Buttons><Ellipsis-Button for tablets>
  * folder display:
 | | | v <Icon> Folder-Name                            <Buttons><Ellipsis-Button for tablets>
  * context menu with entries for new sufolder, new element, delete folder/element, rename folder/element
  * API facilitates additional entries and submenu
  * on tablets: Ellipsis-Button to open context menu
  * dustbin-button "delete"
  * header-line with caption and buttons for new entries/new folders

