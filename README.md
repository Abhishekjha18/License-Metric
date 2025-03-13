# License-Metric (Smart Driver Evaluation System)

An AI-enabled device that assesses driving performance in real-time using accelerometer and gyroscopic data. Built on the STEVAL-MKBOXPRO microcontroller, it provides objective feedback to drivers, aiding in skill improvement and promoting road safety.

## REPORT FILE : [LINK](https://docs.google.com/document/d/1naPfUTfguUxUR_f5OGCVoo8RjADD_p3180a-_BfYthU/edit?usp=sharing)

![License Metric Block Diagram](https://github.com/user-attachments/assets/74b2a78c-3378-4619-9593-f8ee45b92e18)


## Features

- **Real-Time Monitoring:** Continuously tracks acceleration and angular velocity to detect driving behaviors.

- **AI-Powered Analysis:** Utilizes a Binary Decision Tree model trained on real-world data to evaluate driving performance.

- **User Feedback:** Offers immediate, data-driven insights to help drivers identify areas for improvement.

- **Wireless Connectivity:** Supports Wi-Fi and Bluetooth for seamless integration with the ST-BLE mobile app and ST AIOT craft website.

- **Robust Design:** Encased in a custom laser-cut enclosure for durability and easy installation in vehicles.

## Getting Started

### Prerequisites

- **STEVAL-MKBOXPRO Board:** Ensure you have the STEVAL-MKBOXPRO microcontroller board.

- **Mobile Device:** A smartphone or tablet with the ST AIOT CRAFT app installed.

- **Internet Access:** For connecting to the ST AIOT craft website.

- **Firmare On Board:** Make Sure to use correct and compatible firmware for both website and application (We used the FP_SNS_DATALOG2 Firmware) 

### Installation

1. **Hardware Setup:**

   - Secure the STEVAL-MKBOXPRO board inside the laser-cut enclosure.

   - Mount the device in your vehicle, ensuring sensors are correctly oriented.

2. **Software Setup:**

   - Download and install the ST-BLE and ST AIOT CRAFT app from your device's app store.

   - Pair the app with the STEVAL-MKBOXPRO via Bluetooth.
  
   - Flash the FP_SNS_DATALOG2 on the board if not already done.

   - Access the ST AIOT craft website for additional features and data analysis.
  
   - Another way to run a project is , upload the mlc.jason of the project on deta_log window , and start logging the data, it will show you real time input as well as ouput of the mlc and it will store all this data in laptop/sd card as required.

### Usage of STAIOT DEMO

- **Start a Session:** Use the ST-AIOT CRAFT app to initiate a driving session.

- **Monitor Performance:** During the drive, the system analyzes data and provides real-time feedback.

- **Review Results:** After the session, review detailed performance metrics and recommendations on the applications, the results will be stored in .dat format in SD card of box.

- **Demo Video:** This contains the steps and demo of the Project. [video link](https://drive.google.com/drive/folders/1mMX2dlaLDTzLH-lAovJhhp0EJsUk6pEF?usp=drive_link)


##  Usage of Custom Website File

- **Custom Website is developed for better and engaging UI and some more features**

-  **Custom Website Dry Run Link:** [LINK](https://drive.google.com/file/d/18rpwOY8ZAjs-xekbkwIap_OBWk-Ns2Hd/view?usp=sharing)

- **Custom Website CODE Link:**     [LINK](https://drive.google.com/file/d/12tkjrmBdqMAx382L-aopZnIW9H6L-7Rs/view?usp=sharing)



## DIFFERENT MODELS FROM ST-AIOT-CRAFT WEBSITE

- **ALPHA MODEL:** It was giving an accuracy of 75.36%...PLEASE REFER TO THE FILE NAMED default_mlc_alpha to access the mlc.jason and header file of this model.
  
- **ALPHA-BETA MODEL:** It was giving an accuracy of 99.83% to 100%...PLEASE REFER TO THE FILE NAMED alpha_beta_100_mlc to access the mlc.jason and header file of this model.

- **OTHER MODEL FILES:** They were giving an accuracy between 78% to 90%....Files are there in the github repo, they contain the header and mcl.jason files of each model.


## DIFFERENT Datasets FROM ST-AIOT-CRAFT WEBSITE

-Majorly TWO DATASETS were used named as Alpha_dataset and Alpha_Beta_Dataset respective to the mlc model files.[LINK](https://drive.google.com/drive/folders/10Mvk0XSdOOw0eOuSOefHGjGro17YtNK6?usp=drive_link)


## Drive Link For Other Files : [LINK](https://drive.google.com/drive/folders/1tmsuelJD-A1GvjUY1LsMuJc_rQaAfbyA?usp=drive_link)

## BEST RESULTS
- The mlc named alpha_beta_100_mlc.zip, trained on the data alpha_beta_dataset_copy.zip gives an accuracy of more than 99.5 percent.

- YOU CAN ACCESS THE ABOVE MLC AND DATASET FROM UPLOADED FILES IN THIS REPO OR FROM DRIVE ALSO.



## FUTURE WORK YET TO BE DONE
- Better UI to be designed for custom website







