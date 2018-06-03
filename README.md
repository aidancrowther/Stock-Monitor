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
   - [ ] Implement autoscrolling
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
      
Problems:

   Please feel free to notify me of any issues you encounter, and I will fix them as soon as possible. I am open to any suggestions or requests, and will work to make the program as functional as possible
