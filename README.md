# Stock Monitor

Description:

  Stock Monitor is a tool built in Electron to allow shops to easily display all available products by category, subcategory, and sale status. Descriptions and images are both supported for products.
  
Status:
  
   This project is still under heavy development, the current distribution is mostly stable, however it will require careful use, as not all input sanitization has been verified.
   
   Currently Supports:
   
   - Products Names, Categories, Sub-Categories, and Descriptions
   - Multiple Categories per window
   - Multiple windows supported
   - Windows can share categories and subcategories
   
Roadmap:

   - [X] Implement product management
   - [X] Implement layout management
   - [X] Implement window management
   - [X] Implement product displays
   - [ ] Complete README
   - [X] Implement autoscrolling
   - [ ] Prepare release distribution
   
Requirements (Dev):

    - NodeJS
    - Electron
   
Install (Dev):

   - Download repository
     `git clone https://github.com/aidancrowther/Stock-Monitor`
     
   - Navigate to Stock-Monitor folder and install packages
     `npm install`
     
   - Next, install Electron golbally to make running easier
     `npm install electron --global`
     
   - Finally, run Stock Monitor from the project directory with
     `electron .`
      
Usage:

   After running the application, you will be presented with a blank window. Management of all Stock Monitor features is handled through a menu opened by pressing the escape key. This menu will allow you to control all required settings, with breakdown as follows:
   
   __Modify Products__
   
   - Open the 'Modify Products' menu. You will see an empty table, with options to add and remove products at the bottom.
   - Add a product category and sub category in the Add/Remove Category Sub-Menu, as these are required (Ex: Category->Bakery, SubCategory->Cakes).
   - Now you can add your first product in the add product SubMenu, specifying product parameters such as a name, categories, image, and description, as well as product status.
     - Product status will affect the appearance of the product once displayed, giving alternate colorings to product listings to more easily identify produc status.
   - Once a product has been added, exiting the SubMenu should show an updated product listing in the products table, you can also search for products using the search bar
     - By selecting products in this table using the radio buttons, you can modify and/or remove product entries using the buttons below the table.

  __Modify Layout__
  
   - Open the 'Modify Layout' menu. You will see an empty table, with options to add and remove layouts at the bottom.
   - Layouts combine Categories and SubCategories for display purposes, allowing you to specify which SubCategories to display within each MainCategory.
   - Only products that fall within both the specified Category and SubCategories will be displayed in the layout
     - This allows for brands that have multiple product categories to still be displayed (Ex: Category->CPU's, Category->SSD's, SubCategory->Intel).
   - All layouts are then placed within the layouts table, where tehy can be updated, removed, and searched as with the products table.
    
  __Display Settings__
  
   - Open the 'Display Settings' menu. You will see an empty table, with options to add and remove displays at the bottom.
   - Displays specify which layouts will appear within a given display window. You can have as many layouts per window as you would like, with layouts shared between windows.
     - Each additional display past the first one will open a new Stock Monitor window with the specified layouts.
   - Adding a display consists of specifying the categories to display, the time in ms spent scrolling the page, and the time in ms to delay at the top and bottom of the page between scrolling.
   - All displays will then be added to the displays table, where they can be updated and deleted as usual.
     - Note that no changes to the displays will be activated until you press the 'Save and Update Windows' button, which will then cause all window changes to take place.

Problems:

   Please feel free to notify me of any issues you encounter, and I will fix them as soon as possible. I am open to any suggestions or requests, and will work to make the program as functional as possible
