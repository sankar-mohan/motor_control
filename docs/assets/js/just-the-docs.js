var myVariable = `
{"0": {
    "doc": "Configuring the Library",
    "title": "Configuring the Library",
    "content": "Different UI configurations are explained below. Control Algorithm Parameters . Allows to select application mode like open loop or speed loop or torque loop. Position feedback determines the feedback loop implementation like PLL estimator sensorless or Encoder based sensored algorithm. This allows to configure startup parameters and control loop PI parameters. Flying Start Parameters . Allows configuration of Flying Start Detection Parameters. By default, the implementation of this mode is part of an archive file lib_mc_flyingstart.a. In order to access the source file, please contact Microchip’s Local Sales Office. | Flying Start Detect mode uses a separate set of current controller PI gains which can be different than current control PI gains used in normal Run mode. It is recommended that in Flying Start Mode, the current controllers should have higher bandwidth than during normal Run mode. | Flying Start Detect Duration - Defines the duration in seconds for which the control algorithm will attempt to ascertain if the motor is freewheeling. | Minimum Flying Start Speed - Defines the minimum speed in RPM below which if the motor is freewheeling, the control algorithm would deem it as “Not Freewheeling” . | Flying Start Current - Defines the starting current in A which would be used during transition from Flying Start Detection -&gt; Closed Loop operation. | Null Vector Braking Duration - Defines the passive braking duration in seconds, implemented by applying null vector pulses to the motor windings. | Regenerative Braking - When enabled, if the motor’s freewheeling speed is above the minimum flying start detect speed and in the opposite direction to that of command direction, the control algorithm would actively brake the motor using regenerative braking until the motor speed falls below minimum flying start detect speed. | Peak Regenerative Braking Current - Defines the maximum regenerative braking current applied in A. | Regenerative Braking Ramp Duration - Defines the duration in seconds during which the regenerative braking current ramps from 0 to Peak Regenerative Braking Current. | . | . PWM Configurations . Select the PWM frequency and PWM channels used to drive Phase U, V and W based on board connections. Selected configurations are passed to the PWM PLIB. PWM PLIB is auto-configured for FOC algorithm. *Note: Flying start is not supported in SAMC21 and PIC32MK CM MC project. ADC Configurations . Select ADC channels used for Phase U current, Phase V Current, DC Bus voltage and potentiometer based on the board connections. Selected configurations are passed to the ADC PLIB. ADC PLIB is auto-configured for FOC algorithm. Encoder Configurations . Select the number of encoder pulses per revolution of the motor. Selected configurations are passed to the QDEC PLIB. Motor Parameters . Allows to configure motor parameters. Microchip direct motors are selectable and pre-configured. User can select custom motor to configure parameters for other motors. Control Board Parameters . Allows to configure control board parameters. Microchip’s motor control development boards like dsPICDEM MCLV-2 development board are selectable and pre-configured. User can select custom board to configure parameters for other boards. IO Pin Configurations . Configure I/O pins for PWM, ADC, Encoder, UART, input switches and LEDs using the pin manager. Clock Configurations . CPU clock speed is defaulted to maximum recommended clock frequency of the MCU. View or modify the clock speed using clock manager. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/configurations.html",
    "relUrl": "/algorithms/pmsm_foc/configurations.html"
  },"1": {
    "doc": "Control Algorithm",
    "title": "Control Algorithm",
    "content": "Field Oriented Control (FOC): . Field Oriented Control is the technique used to achieve the decoupled control of torque and flux. This is done by transforming the stator current quantities (phase currents) from stationary reference frame to torque and flux producing currents components in rotating reference frame using mathematical transformations. The Field Oriented Control is done as follows: . | Measure the motor phase currents. | Transform them into the two phase system (a, b) using the Clarke transformation. | Calculate the rotor position angle. There are different ways to get the rotor position angle like using PLL estimator or quadrature encoder sensor. | Transform stator currents into the d,q-coordinate system using the Park transformation. | The stator current’s torque (iq) and flux (id) producing components are controlled separately by the controllers. | The output stator voltage space vector is transformed back from the d,q-coordinate system into the two phase system fixed with the stator by the Inverse Park transformation. | Using the space vector modulation, the three-phase output voltage is generated. | . PLL Estimator . The working principle of the PLL estimator can be found in Application Note AN2520. Its operating principle is based on the fact that the d-component of the Back Electromotive Force (BEMF) must be equal to zero at a steady state functioning mode. The main disadvantage of PLL estimator is its inability to estimate the rotor angle at lower rotor speeds because of very low value of back EMF. Therefore, the FOC algorithm also integrates the ramp-up profile for motor start. The reference speed is incremented linearly using an open loop phase voltage control until the required minimum reference speed for the PLL estimator is reached. Reduced Order Luenberger Observer . The working principle of the Reduced Order Luenberger Observer can be found in Application Note AN2590. Like any other back EMF based sensorless technique, the main disadvantage of Reduced Order Luenberger Observer is its inability to estimate the rotor angle at lower rotor speeds because of very low value of back EMF. Therefore, the FOC algorithm also integrates the ramp-up profile for motor start. The reference speed is incremented linearly using an open loop phase voltage control until the required minimum reference speed for the observer is reached. Quadrature Encoder . An incremental optical encoder provides two pulse trains which are in quadrature with each other. Some encoders also have an index pulse which helps in finding the precide rotor position spatially. Microcontroller quadrature encoder peripheral is used to capture and decode quadrature encoder siganls. Peripheral gives the rotor position based on the quadrature pulse. And velocity is calculated by measuring encoder pulses in known time interval. PIC32MK QEI peripheral gives the velocity directly. Please refer to the Application Note AN2757 . Field Weakening . The field weakening for PMSM implies imposing a negative value of d-axis current, which has the role of weakening the air gap flux linkage. Field weakening is required to enable the PMSM motor to rotate above its rated speed. An equation based field weakening is implemented. Flying Start . This feature detects if motor shaft is freewheeling due to stored momentum or external force and estimates the rotor angle, speed and direction of the freewheeling motor. If the freewheeling speed is greater than the minimum speed and is rotating in intended direction, this algorithm catches the motor rotation and directly switches to closed loop control. If speed is less then it applies break to halt the motor and starts the control from stationary position. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/control_algorithm.html",
    "relUrl": "/algorithms/pmsm_foc/control_algorithm.html"
  },"2": {
    "doc": "Create MCC project for MC Plant",
    "title": "Create a new MPLAB® Harmony v3 project using MCC",
    "content": "This section describes step by step process for creating a new Motor Control Project using MPLAB Code Configurator (MCC) from scratch. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/create_mc_project_with_mcc.html#create-a-new-mplab-harmony-v3-project-using-mcc",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/create_mc_project_with_mcc.html#create-a-new-mplab-harmony-v3-project-using-mcc"
  },"3": {
    "doc": "Create MCC project for MC Plant",
    "title": "Procedure",
    "content": "The following section describes uses SAME70 microcontroller to illustrate the process for creating a new motor control project with Motor Control Plant. | Launch MPLAB® X IDE from the Microsoft Windows® Start menu. | Go to the File option in the menu bar and select “New project” | In the Categories pane of the New Project dialog, select Microchip Embedded. In the Projects pane, select 32-bit MCC Harmony Project, then click Next. | In the Framework Path edit box, browse to the folder where you downloaded the framework. Figure.1 - Framework path . | In the Project Settings window, apply the following settings: . | Location: Indicates the path to the root folder of the new project. All project files will be placed inside this folder. The project location can be any valid path, for example: \\\\dev\\\\same51n_getting_started. | Folder: Indicates the name of the MPLABX .X folder. Enter “sam_e51_cnano” to create a sam_e51_cnano.X folder. | Name: Enter the project’s logical name as “getting_started_sam_e51_cnano”. This is the name that will be shown from within MPLAB X IDE. | Click Next to proceed to Configuration Settings. | . Figure.1 - Project set-up . | Follow the steps below to set the project’s Configuration Settings. | Name: Enter the configuration name as “mclv2_sam_e70_pim”. | Target Device: Select ATSAME70Q21B as the target device. Figure.1 - Project set-up . | . | In MCC Content Manager Wizard window, click on “Select MPLAB Harmony” . Figure.1 - Project set-up . | In MCC Content Manager Wizard window, click on “Finish” Figure.1 - Project set-up . | Add MCC components from the ** Device Resources** to the Project Graph . | Add PMSM FOC component | Add and connect ADC, PWM, QDEC and Data Stream dependencies to PMSM FOC | Add SAM E70 PIM MC Board from the Board Support Packages | . Figure.1 - Project set-up . | Launch Motor Control Plant Manager plugin | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/create_mc_project_with_mcc.html#procedure",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/create_mc_project_with_mcc.html#procedure"
  },"4": {
    "doc": "Create MCC project for MC Plant",
    "title": "Create MCC project for MC Plant",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/create_mc_project_with_mcc.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/create_mc_project_with_mcc.html"
  },"5": {
    "doc": "Current Measurement",
    "title": "Current Measurement",
    "content": "The phase current information is crucial to control the torque of the motor of an electric drive with Field Oriented Control. The following section describes different current measurement principles in an electric drive, and how it can be configured with Motor Control Plant. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html#current-measurement",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html#current-measurement"
  },"6": {
    "doc": "Current Measurement",
    "title": "Current Measurement Principles:",
    "content": "Figure 1 shows different measurement principles used for phase current measurement in an electric drive. Figure.1 - Current Measurement Principles . Each of the above shown measurement principles has its own pros and cons. Discussion of all the measurement principles is beyond the scope on this section. Therefore, this document focuses on resistive based current measurement principles which are by far are the most sought after techniques. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html#current-measurement-principles",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html#current-measurement-principles"
  },"7": {
    "doc": "Current Measurement",
    "title": "Resistive based",
    "content": "This technique places specially designed resistors usually referred as shunt resistors along the path of the current which has to be measured. The voltage drop across these shunt resistors is used to calculate the current values using Ohm’s law as follows: . The resistive based techniques cost-effective solution for most of the low and medium power electric drives. Its other advantages include high accuracy, high bandwidth, low temperature drift and unlike magnetic based sensors it does not have any remanence. As with any other techniques resistive based techniques have their own drawbacks. By design, they do not provide any galvanic isolation, and incurs power losses while measurement. Refer AN1332 for more details. Based on where number shunts and their respective location for measuring current in an electric drive, the resistive based techniques can be classified into three categories: . | Three shunt | Dual shunt | Single shunt | . Three shunt . Figure 2 shows a three shunt phase current measurement technique. Figure.2 - Three shunt current measurement . This technique employs three shunt resistors along the three inverter legs. At each modulation cycle, when the low side FETs are switched on, the phase currents are measured. The three shunt current measurement has some advantages. The three shunt technique generally selects the two samples for which the low side FET were switched on for a longer duration, and the third current is calculated from Kirchhoff’s current law (KCL). Hence, a lower bandwidth amplifiers can be used to measure the voltages. Additionally, this makes over-modulation simpler. Dual shunt . Figure 3 shows a typical dual current measurement technique. &lt;img src=\\\"images/dual_shunt_current_measurement.jpg \\\"Dual shunt current measurement\\\") .jpg\\\" /&gt; Figure.3 - Dual shunt current measurement . This technique employs two shunt resistors along the three inverter legs. At each modulation cycle, when the low side FETs are switched on, the phase currents of the two respective legs are then measured. The third current is calculated from Kirchhoff’s current law (KCL). Single shunt . Figure 4 shows a typical single current measurement technique. Figure.4 - Single shunt current measurement . This technique measures the DC link current and, with knowledge of the switching states, reconstructs each of the three-phase currents. For more technical details refer AN1299 . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html#resistive-based",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html#resistive-based"
  },"8": {
    "doc": "Current Measurement",
    "title": "Current Measurement",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/current_measurement.html"
  },"9": {
    "doc": "Field Oriented Control",
    "title": "Introduction",
    "content": "The Field Oriented Control (FOC) is the conventional control scheme for permanent-magnet synchronous motors. It generally results in smoother torque, slightly higher efficiency, and higher torque-speed curve, compared to six-step control, but requires a measurement or estimate of rotor position, and is more computationally intensive. This section introduces the field oriented control. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#introduction",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#introduction"
  },"10": {
    "doc": "Field Oriented Control",
    "title": "Torque Production in three-phase AC motor",
    "content": "A three-phase AC has a stationary part called the stator; a rotating part called the rotor. The stator consists of three-phase windings. When the stator is excited with a balanced three-phase voltage, it generates a rotating magnetic field. The rotor has generates its own magnetic field either using implanted magnets (in Permanent Magnet Synchronous Motors) or using electromagnets (Synchronous or Asynchronous AC motors). The rotor’s magnetic field interacts with the stator’s rotating magnetic field to produce the rotor torque. Electromagnetic torque is proportional to the cross product of stator currents and rotor flux linkage. Here is a unit vector along the axis of rotation, and are components of a two-dimensional plane perpendicular to , and the current vector is an equivalent vector sum of currents based on how the resulting fields are aligned with these and axes. The angle between flux linkage and current vectors, illustrated in Figure 1, plays an important role in determining electromagnetic torque. If the two vectors are aligned, this angle is zero, and no torque is produced. Maximum torque occurs when the flux linkage and current vectors are perpendicular, and the term . Figure 1. Phasor diagram Figure 1 Flux linkage vector, current vector, and the angle between them, in an arbitrary coordinate frame. It is important to note that these and axes are arbitrary — we can pick any unit basis vectors and that form a mutually perpendicular set with the axis of rotation , such that their cross product . There are two common choices for these basis vectors. One is the stationary frame, commonly aligned with one of the stator phases. Pictured on the left of Figure 2 is a three-phase stator with windings positioned 120° apart. This is equivalent — at least in terms of magnetic flux linkage — to a two-phase stator with orthogonal windings α and β, pictured on the right. For any combination of currents , , in the three-phase stator winding, the same magnetic field seen by the rotor can be produced by an appropriate combination of currents and through two “virtual” coils used to create the horizontal and vertical components of the stator field. The mathematical conversion of projecting three-phase quantities onto these virtual orthogonal coils is called the Clarke transform, after one of its originators, Edith Clarke. [2]. Figure 2. Current vector coils Figure 2 Use of Clarke transform to convert between per-phase quantities and the frame The angle reference is commonly aligned with the first motor phase and the winding. The rotor’s position is some electrical angle relative to these angle references. The Clarke transform is a linear transformation, shown in following equation, which can apply to any vector quantity , although typical examples are voltage , current , or flux linkage . We can substitute in above equation to get the following equation describing torque based on stationary-frame quantities: . In the stationary reference frame, the flux vector and current vector are not fixed, but rotate along with the rotor’s magnetic field. The other common choice of basis vectors is the rotating reference frame, aligned with the electrical angle of excitation as it increases with electrical frequency . This reference frame has components denoted dd (“direct”) and qq (“quadrature”). The transformation from to axes is a rotation by an angle . This is known as the Park transform, named for Robert Park, who developed it in the late 1920s, while working at General Electric to analyze the dynamics of synchronous motors. [1] [3] With permanent-magnet synchronous motors, this reference frame is known as the synchronous reference frame. Correct alignment for a PMSM occurs when the -axis is aligned with the rotor flux, and the electrical angle is identical to the rotor’s electrical angle . We can substitute in Equation 5.2 to obtain Equation 5.9, describing torque based on synchronous-frame quantities: . The advantage of using the synchronous frame is that for steady-state rotation, to produce constant electromagnetic torque , the flux linkage vector and the current vector are constants. This allows current controllers with an integrator term to operate with zero steady-state error. It also allows for independent torque and flux control. It is worth noting that for different motor types, the angle of the reference frame and the electrical angle of the rotor may or may not be identical. For permanent-magnet synchronous motors, the reference frame should be aligned with the permanent magnet flux of the rotor, so that . For induction motors ; the electrical frequency where is the rotor speed expressed as an electrical frequency, and is the slip frequency needed to produce rotor current. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#torque-production-in-three-phase-ac-motor",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#torque-production-in-three-phase-ac-motor"
  },"11": {
    "doc": "Field Oriented Control",
    "title": "FOC block diagram",
    "content": "The general structure of an FOC controller is an inner vector current loop, and an outer velocity loop, as shown in Figure 3. Figure 3. FOC Block Diagram The inner vector current loop has a current controller that operates in the synchronous frame. Park and Clarke transforms are used in the feedback path to convert measured phase currents to the synchronous frame as inputs to the current controller, and in the forward path to convert desired synchronous-frame voltages to realizable PWM duty cycles in a three-phase bridge. In its linear range, there is nothing particularly special about the vector current loop, and it is often realized as two PI controllers, one for the d axis and the other for the q axis. Saturation and anti-windup should be designed carefully, keeping in mind the overall vector controller, rather than as two independent axis controllers. The following steps summarize the basic sensorless FOC operation: . | Measure the current flowing in the motor. There are several ways to measure the three-phase currents flowing in the motor. Some popular options include measurement using hall-effect or transformer-based magnetic sensors or using strategically placed one, two or three shunt resistors. | Estimate the rotor flux angle. The rotor flux angle can be estimated by either back EMF-based algorithms or by high-frequency pulse injection. | Transform the measured current to reference frame. The measured phase currents of the motor are transformed to two orthogonal components in reference frame by Clarke Transformation. | Transform the current to current. The are transformed to two orthogonal components in reference frame using the estimated rotor flux angle by Park Transformation. | Compare the measured current with the desired current and generate an error signal. The desired -axis reference current for controlling the torque, and desired -axis current for controlling the flux are compared with their corresponding measured quantities to generate respective error signals. | Calculate control voltage from the error signal. The error signals are used to calculate correction voltage. Conventionally a closed-loop feedback mechanism using a PI regulator is used for the task. | Apply control voltage to motor terminals. The correction voltage in reference frame is transformed back to voltages in reference frame. These voltages are applied to the motor terminals by some power switching techniques. Conventionally in MCU-based systems, PWM modulation techniques like Space Vector modulation are used for the task. | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#foc-block-diagram",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#foc-block-diagram"
  },"12": {
    "doc": "Field Oriented Control",
    "title": "References",
    "content": "Some of the material in this section was adapted from the section “FOC in Fifteen Minutes” from the 2016 MASTERS presentation How to Succeed in Motor Control. | R. H. Park, “Two-reaction theory of synchronous machines generalized method of analysis-part I,”, Transactions of the American Institute of Electrical Engineers, vol. 48, no. 3, pp. 716-727, July 1929. | W. C. Duesterhoeft, M. W. Schulz and E. Clarke, “Determination of Instantaneous Currents and Voltages by Means of Alpha, Beta, and Zero Components,”, Transactions of the American Institute of Electrical Engineers, vol. 70, no. 2, pp. 1248-1255, July 1951. | C. J. O’Rourke, M. M. Qasim, M. R. Overlin and J. L. Kirtley, “A Geometric Interpretation of Reference Frames and Transformations: dq0, Clarke, and Park,”, IEEE Transactions on Energy Conversion, vol. 34, no. 4, pp. 2070-2083, Dec. 2019. Also available via MIT Open Access. | D. Busse, J. Erdman, R. J. Kerkman, D. Schlegel and G. Skibinski, “Bearing currents and their relationship to PWM drives,”, IEEE Transactions on Power Electronics, vol. 12, no. 2, pp. 243-252, March 1997. | Annette von Jouanne and Haoran Zhang, “Bearing Currents: A Major Source of Mechanical Failure for Motors in Adjustable Speed Drive Applications”, Turning Point (US Department of Energy), p. 3, Sep 1998. | IEC 60034-8 Rotating electrical machines, Part 8: Terminal markings and direction of rotation | For copper temperature coefficient, see the two sources below. The figure 0.00393/°C is bandied about quite a lot, but this was decided by convention in 1913, based on data available at the time. (See [8], page 4.) The 1979 article by Matula [9] identifies and re-publishes numerous datasets for copper resistivity measurements and proposes an interpolated table of Recommended Values for the Electrical Resistivity of Copper (see table 2) vs. temperature. | “Copper Wire Tables”, National Bureau of Standards Handbook 100, February 1966. | “Electrical resistivity of copper, gold, palladium, and silver”, R. A. Matula, Journal of Physical and Chemical Reference Data, vol. 8, no. 4, pp. 1147-1298, Oct 1979. | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#references",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html#references"
  },"13": {
    "doc": "Field Oriented Control",
    "title": "Field Oriented Control",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/field_oriened_control.html"
  },"14": {
    "doc": "Generate Code with MCC",
    "title": "Generate code with MCC",
    "content": "Click on the generate button to generate the code. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/generate_mc_code_with_mcc.html#generate-code-with-mcc",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/generate_mc_code_with_mcc.html#generate-code-with-mcc"
  },"15": {
    "doc": "Generate Code with MCC",
    "title": "Generate Code with MCC",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/generate_mc_code_with_mcc.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/generate_mc_code_with_mcc.html"
  },"16": {
    "doc": "Getting Started",
    "title": "Getting Started",
    "content": "This section describes how to quickly develop a motor control application project with Motor Control Plant . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/getting_started.html#getting-started",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/getting_started.html#getting-started"
  },"17": {
    "doc": "Getting Started",
    "title": "Getting Started",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/getting_started.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/getting_started.html"
  },"18": {
    "doc": "Hardware Modules",
    "title": "Setting Hardware Modules",
    "content": "This section describes how to set-up hardware modules for motor control application project with Motor Control Plant. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-hardware-modules",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-hardware-modules"
  },"19": {
    "doc": "Hardware Modules",
    "title": "Configure PMSM parameters",
    "content": "The PMSM parameter can be configured in following simple steps: . | Click on the motor block to open PMSM parameter window as shown below. | Configure the motor parameters as shown below. | Close the window ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#configure-pmsm-parameters",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#configure-pmsm-parameters"
  },"20": {
    "doc": "Hardware Modules",
    "title": "Configure Development Board",
    "content": "There are two ways by which the motor control board can be configured. | By selecting the board from the list of Microchip’s development boards and reference designs. | By configuring the board Parameters from scratch. | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#configure-development-board",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#configure-development-board"
  },"21": {
    "doc": "Hardware Modules",
    "title": "Microchip’s Development Board and Reference Designs",
    "content": "Microchip offers a number of motor control development boards and reference designs. These boards can be selected from Quick Settings logo to use these boards for developmental activities. Following steps list the procedure to select the Motor Control Plant supported development board and reference design. | Click on the “Quick setting” icon as shown below. | Select appropriate motor from “Select Board” option as shown below. | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#microchips-development-board-and-reference-designs",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#microchips-development-board-and-reference-designs"
  },"22": {
    "doc": "Hardware Modules",
    "title": "Setting Board Parameters from Scratch",
    "content": "The Motor Control Plant can be used to configure the board parameters from scratch. Following steps list the procedure to configure the board parameters from scratch. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-board-parameters-from-scratch",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-board-parameters-from-scratch"
  },"23": {
    "doc": "Hardware Modules",
    "title": "Setting Analog Front End",
    "content": "The following section describes various analog front end circuit and how it can be configured using Motor Control Plant. Theoretical Background . The Field Oriented Control of an AC motor requires current, voltage and rotor position information. These signals are processed using analog circuits before it is sent to the microcontroller to be used for the control tasks. The control software has to be cognizant of these analog circuit parameters in order to reconstruct the actual analog signal for control operations. Phase Current Measurement . There are a number of other ways of measuring the phase currents. For brief introduction refer Current Measurement in AC motor drives. DC Bus Voltage Measurement . The DC bus voltage is usually measured by using a resistor based potential divider. Configuring Analog front End with MC Plant . In Motor Control Plant analog parameters can be set in following steps. | Launch Analog Front End by clicking on the block . | Configure Phase A current measurement analog circuit parameters by clicking on the IaSens icon. | Configure Phase B current measurement analog circuit parameters by clicking on the IbSens icon. | Configure DC Bus current measurement analog circuit parameters by clicking on the VdcSens icon. | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-analog-front-end",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-analog-front-end"
  },"24": {
    "doc": "Hardware Modules",
    "title": "Setting Analog Interface",
    "content": "The following section describes the analog interfaces and how it can be configured using Motor Control Plant. Theoretical Background . The analog signals has to be converted to digital signals for the microcontroller devices to use. For Field Oriented control, the analog signals are converted to corresponding digital signals using ADCs. Figure shows a conceptual diagram of Analog to digital conversion. For an ADC with 12 bit resolution, the conversion can be expressed as follows: $ V_{adc} = \\frac{4096*V_{in}}{V_{ref}} $ . The software essentially has to perform following tasks: . | Set the ADC unit and channel to be used to convert analog signals to digital signals | Configure ADC parameters like resolution, trigger source etc. | . Configuring Analog Interface using MC Plant . In Motor Control Plant analog parameters can be set in following steps. | Launch Analog Interface by clicking on the block . | Configure analog interface Group 01 signals, i.e. phase current A and phase current B by clicking on Group 01 icon . | Configure analog interface Group 02 signals, i.e. DC bus voltage and potentiometer by clicking on Group 02 icon . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-analog-interface",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html#setting-analog-interface"
  },"25": {
    "doc": "Hardware Modules",
    "title": "Hardware Modules",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/hardware_modules.html"
  },"26": {
    "doc": "Motor Control Plant Projects",
    "title": "Theoretical Background",
    "content": "This section briefly describes some of the theoretical concepts related to PMSM control. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/introduction.html#theoretical-background",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/introduction.html#theoretical-background"
  },"27": {
    "doc": "Motor Control Plant Projects",
    "title": "Motor Control Plant",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/introduction.html#motor-control-plant",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/introduction.html#motor-control-plant"
  },"28": {
    "doc": "Motor Control Plant Projects",
    "title": "Introduction",
    "content": "The Motor Control Plant Configurator (MCPC) is an extension of the MPLAB® ecosystem for developing Microchip’s next-generation application firmware for motor control on Microchip® 32-bit devices. It has a graphical tool that enables an effortless configuration and generation of motor control application C code for Microchip 32-bit devices. &lt;p align=\\\"center\\\"&gt; &lt;figcaption align= \\\"center\\\"&gt; System Diagram &lt;/figcaption&gt; &lt;/p&gt; . This document introduces the readers to the basics of an PMSM based electric motor drive, and how Motor Control Plant can be used to quickly develop their own motor control application firmware. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/introduction.html#introduction",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/introduction.html#introduction"
  },"29": {
    "doc": "Motor Control Plant Projects",
    "title": "Electrical Motor Drive",
    "content": ". | Permanent Magnet Synchronous Motor | Field Oriented Control (FOC) . | Field Oriented Control Theory | Current Measurement Principles | Rotor Position Measurement Principles | . | Software Design and Architecture | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/introduction.html#electrical-motor-drive",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/introduction.html#electrical-motor-drive"
  },"30": {
    "doc": "Motor Control Plant Projects",
    "title": "Getting Started",
    "content": "This section briefly describes the basic steps to get started with the Motor Control Plant. It consists of following steps: . | Create a new MPLAB® Harmony v3 project using MCC | Configure motor control firmware using Motor Control Plant Manager | Generate the source code | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/introduction.html#getting-started",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/introduction.html#getting-started"
  },"31": {
    "doc": "Motor Control Plant Projects",
    "title": "Motor Control Plant Projects",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/introduction.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/introduction.html"
  },"32": {
    "doc": "MC Plant Manager",
    "title": "Motor Control Plant Manager",
    "content": "The Motor Control Plant Manager (MCPM) is an intuitive graphical tool for developing motor control application software. The following section briefly describes how to configure motor control firmware for a user application. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/motor_control_plant_manager.html#motor-control-plant-manager",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/motor_control_plant_manager.html#motor-control-plant-manager"
  },"33": {
    "doc": "MC Plant Manager",
    "title": "How to configure Motor Control Application",
    "content": ". | Launch the Motor Control Plant Manager from the MCC plugin list. Figure.1 - Launching Motor Control Plant Manager . | Set the motor and board parameters. Figure.2 - Motor and Board Parameters . Click here for details . | Set the microcontroller peripherals. Figure.3 - Microcontroller Peripherals . Click here for details . | Set the software modules. Figure.4 - Software modules . Click here for details . | Set advanced project options. Figure.5 - Advanced options . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/motor_control_plant_manager.html#how-to-configure-motor-control-application",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/motor_control_plant_manager.html#how-to-configure-motor-control-application"
  },"34": {
    "doc": "MC Plant Manager",
    "title": "MC Plant Manager",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/motor_control_plant_manager.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/motor_control_plant_manager.html"
  },"35": {
    "doc": "License",
    "title": "License",
    "content": "MICROCHIP SOFTWARE IS PROVIDED SOLELY TO ASSIST YOU IN DEVELOPING PRODUCTS AND SYSTEMS THAT USE MICROCHIP PRODUCTS. DOWNLOAD AND/OR USE OF THE SOFTWARE REQUIRES THAT YOU ACCEPT THIS SOFTWARE LICENSE AGREEMENT. IF YOU DO NOT WISH TO ACCEPT THESE TERMS, DO NOT DOWNLOAD OR USE ANY OF THE SOFTWARE. DOWNLOADING OR USING THE SOFTWARE CONTITUTES YOUR ACCEPTANCE OF THIS SOFTWARE LICENSE AGREEMENT. SOFTWARE LICENSE AGREEMENT . This Software License Agreement (\\\"Agreement\\\") is an agreement between you (if licensing as an individual) or the entity you represent (if licensing as a business) (\\\"you\\\" or \\\"Licensee\\\") and Microchip Technology Incorporated, a Delaware corporation, with a place of business at 2355 W. Chandler Blvd., Chandler, AZ 85224-6199, and its affiliates including Microchip Technology Ireland Limited, a company organized under the laws of Ireland, with a principal address at Ground Floor, Block W., East Point Business Park, Dublin, Ireland 3 (collectively, \\\"Microchip\\\") for the Microchip MPLAB Harmony Integrated Software Framework and documentation included in the download or otherwise provided by Microchip to Licensee (collectively, the \\\"Software\\\"). 1. Use. Subject to the terms of this Agreement, Microchip hereby grants Licensee a limited, revocable, non-exclusive, non-transferable, worldwide license to (a) use the Software, and (b) modify the Software provided in source code form, if any (and use and copy modifications of such Software made by Licensee), provided that in each case (with respect to clauses (a) and (b)) Licensee solely uses the Software with Microchip Products, Licensee Products, or other products agreed to by Microchip in writing. Licensee has no right to (i) substitute third party products for Microchip Products, or (ii) except as expressly provided in Section 2 below, sublicense its rights under this Agreement or otherwise disclose or distribute the Software to any third party. Licensee may make a reasonable number of copies of the Software solely as necessary to exercise its license rights in this Section 1. Licensee will not remove or alter any copyright, trademark, or other proprietary notices contained on or in the Software or any copies. “Microchip Products” means those Microchip devices purchased from Microchip or one of its authorized distributors that are identified in the Software, or if not identified in the Software, then such Microchip devices that are consistent with the purpose of the Software, including but not limited to Microchip 32-bit microcontroller and microprocessor devices and the like. “Licensee Products” means products manufactured by or for Licensee that use or incorporate Microchip Products. 2. Subcontractors. If Licensee wishes for its subcontractor to obtain and use the Software in order to provide design, manufacturing, or other services to Licensee: (a) such subcontractor may (i) download and agree to the terms of this Agreement or (ii) contact Microchip directly for a copy of this Agreement and agree to its terms; or (b) Licensee may sublicense the rights described in Section 1 directly to its subcontractor, provided that (i) such subcontractor agrees in writing to the terms of this Agreement � a copy of which will be provided to Microchip upon request, and (ii) Licensee is liable for such subcontractor's acts and omissions. 3. Third Party Software. (a) Third Party Materials. Licensee agrees to comply with third party license terms applicable to Third Party Materials, if any. Microchip will not be held responsible for Licensee's failure to comply with such terms. Microchip has no obligation to provide support or maintenance for Third Party Materials. \\\"Third Party Materials\\\" means the third party software, systems, tools, or specifications (including those of a standards setting organization) referenced in, bundled with, or included in the Software. (b) Open Source Components. Notwithstanding the license grant in Section 1 above, Licensee acknowledges that the Software may include Open Source Components. To the extent required by the licenses covering Open Source Components, the terms of such license apply in lieu of the terms of this Agreement. To the extent the terms of the licenses applicable to Open Source Components prohibit any of the restrictions in this Agreement with respect to such Open Source Components, those restrictions will not apply to the Open Source Component. \\\"Open Source Components\\\" means components of the Software that are subject to the terms of an Open Source License. \\\"Open Source License\\\" means any software license approved as an open source license by the Open Source Initiative or any substantially similar license, including without limitation any license that, as a condition of distribution of the software licensed under such license, requires that the distributor make the software available in source code format. 4. Licensee Obligations. (a) Restrictions. Except as expressly permitted by this Agreement, Licensee agrees that it will not (i) modify or alter the Software or a Microchip Product; (ii) adapt, translate, decompile, reverse engineer, disassemble the Software provided in object code form, any Microchip Product, or any samples or prototypes provided by Microchip, or create derivative works thereof; or (iii) use the Software with any software or other materials that are subject to licenses or restrictions (e.g., Open Source Licenses) that, when combined with the Software, would require Microchip to disclose, license, distribute, or otherwise make all or any part of such Software available to anyone. (b) Indemnity. Licensee will indemnify (and, at Microchip's election, defend) Microchip from and against any and all claims, costs, damages, expenses (including reasonable attorneys' fees), liabilities, and losses, arising out of or related to: (i) Licensee's modification, disclosure, or distribution of the Software or Third Party Materials; (ii) the use, sale, or distribution of Licensee Products; and (iii) an allegation that Licensee Products or Licensee's modification of the Software infringe third party intellectual property rights. (c) Licensee Products. Licensee understands and agrees that Licensee remains responsible for using its independent analysis, evaluation, and judgment in designing Licensee Products and systems and has full and exclusive responsibility to assure the safety of its products and compliance of its products (and of all Microchip Products used in or for such Licensee Products) with applicable laws and requirements. 5. Confidentiality. (a) Licensee agrees that the Software, underlying inventions, algorithms, know-how, and ideas relating to the Software, and any other non-public business or technical information disclosed by Microchip to Licensee are confidential and proprietary information, including information derived therefrom, belonging to Microchip and its licensors (collectively, \\\"Confidential Information\\\"). Licensee will use Confidential Information only to exercise its rights and perform its obligations under this Agreement and will take all reasonable measures to protect the secrecy of and avoid unauthorized access, disclosure, and use of Confidential Information. Such measures include, but are not limited to, the highest degree of care that it uses to protect its own information of a similar nature, but not less than reasonable care. Licensee will only disclose Confidential Information to its employees, subcontractors, consultants, auditors and representatives (collectively \\\"Representatives\\\") who have a need to know such information and who have use and confidentiality obligations to Licensee at least as restrictive as those set forth in this Agreement. Licensee is responsible for disclosure or misuse of Confidential Information by its Representatives. Use of Confidential Information for personal gain, for the benefit of a third party or to compete with Microchip, whether directly or indirectly, is a breach of this Agreement. Licensee will notify Microchip in writing of any actual or suspected misuse, misappropriation, or unauthorized disclosure of Confidential Information that comes to Licensee's attention. Confidential Information will not include information that: (i) is or becomes publicly available without breach of this Agreement; (ii) is known or becomes known to Licensee from a source other than Microchip without restriction and without breach of this Agreement or violation of Microchip's rights, as demonstrated by credible evidence in existence at the time of disclosure; (iii) is independently developed by Licensee without use of or reference to the Confidential Information, as demonstrated by credible evidence in existence at the time of independent development; or (iv) is disclosed generally to third parties by Microchip without restrictions similar to those contained in this Agreement. Licensee may disclose Confidential Information to the extent required under law, rule, or regulation (including those of any national securities exchange), by subpoena, civil investigative demand, or similar process, or by a court or administrative agency (each a \\\"Requirement\\\"'), provided, that to the extent permitted by applicable law, Licensee will provide prompt notice of such Requirement to Microchip to enable Microchip to seek a protective order or otherwise prevent or restrict such disclosure. (b) Return of Materials. Upon Microchip's request and direction, Licensee will promptly return or destroy the Confidential Information, including any physical information or materials provided to Licensee (together with any copies, excerpts, syntheses, CD ROMS, diskettes, etc.), and, in the case of information derived therefrom, provide written certification that all the Confidential Information has been expunged from any such materials or that all such materials have been destroyed. Further, if Licensee or its affiliates become competitors of Microchip, and Microchip notifies Licensee in writing of its status as a competitor in a given market, then Licensee will promptly engage in the return and certification process described above in this Section 5(b). 6. Ownership and Retention of Rights. All rights, title, and interest (including all intellectual property rights) in and to the Software, including any derivative works of the Software and any incremental modifications to the Software whether made by or for Licensee or Microchip (collectively, \\\"Microchip Property\\\"), are and will remain the sole and exclusive property of Microchip, whether such Microchip Property is separate or combined with any other products. Licensee, on behalf of itself and its affiliates, agrees to, and does hereby, assign to Microchip or its designee all right, title and interest (including all intellectual property rights) in and to derivative works of and any incremental modifications to the Software. Licensee will take (and will cause its affiliates, their subcontractors, and all related individuals to take) all action as may be reasonably necessary, proper or advisable to perfect and secure the ownership, licenses, intellectual property and other rights of or to Microchip as set forth in this Agreement. All rights not expressly granted under this Agreement are reserved to Microchip and its licensors and suppliers, and there are no implied rights. Licensee retains all right, title, and interest in and to any technology independently developed by Licensee not derived, directly or indirectly, from the Microchip Property or any other item of tangible property provided to Licensee by Microchip hereunder. 7. Termination. This Agreement will start once accepted by Licensee and continue unless and until terminated as provided in this Agreement. This Agreement automatically terminates immediately if Licensee violates the restrictions set forth in Sections 1, 2 or 4(a). Microchip may terminate this Agreement immediately upon notice if (a) Licensee or its affiliates become competitors of Microchip, or (b) Licensee breaches any other term of this Agreement and does not cure such breach within 30 days after receipt of written notice of such breach from Microchip. Upon termination of this Agreement, (i) the license grants in Sections 1 and 2(b) terminate, and (ii) Licensee will return to Microchip or destroy (and certify the destruction of) all Microchip Property and Confidential Information in its possession or under its control, and all copies thereof. The following sections survive termination of this Agreement: 3, 4, 5, 6, 7, 8, 9, 10, 11 and 12. 8. Dangerous Applications. The Software is not fault-tolerant and is not designed, manufactured, or intended for use in hazardous environments requiring failsafe performance (\\\"Dangerous Applications\\\"). Dangerous Applications include the operation of nuclear facilities, aircraft navigation, aircraft communication systems, air traffic control, direct life support machines, weapons systems, or any environment or system in which the failure of the Software could lead directly or indirectly to death, personal injury, or severe physical or environmental damage. Microchip specifically disclaims (a) any express or implied warranty of fitness for use of the Software in Dangerous Applications; and (b) any and all liability for loss, damages and claims resulting from the use of the Software in Dangerous Applications. 9. EU Consumers � Applicable Terms. WHERE LICENSEE IS A CONSUMER LOCATED IN EUROPE, THE FOLLOWING PROVISIONS APPLY INSTEAD OF SECTIONS 9 AND 10 BELOW: Microchip and its licensors will not be liable (a) for any loss suffered by Licensee in connection with the Software where such loss was not reasonably foreseeable when the Software was first downloaded by Licensee, even if such loss was the result of negligence or the failure of Microchip and its licensors to comply with this Agreement; or (b) irrespective of the basis of claim, for any loss of revenue, profit or other business or economic loss suffered. Some Software is made available to Licensee free of charge, and Licensee may at any time download further copies without charge to replace the Software initially downloaded and others may require a fee to be downloaded, or to download any further copies. In all circumstances, to the extent liability may lawfully be limited or excluded, the cumulative liability of Microchip and its licensors will not exceed USD$1,000 (or equivalent sum in the currency of the country in which Licensee resides). However, none of the foregoing limits or excludes any liability for death or personal injury arising from negligence, or for fraud, fraudulent misrepresentation or any other cause that by law cannot be excluded and limited. 10. Warranty Disclaimers. EXCEPT FOR CONSUMERS TO WHOM SECTION 8 APPLIES, THE SOFTWARE IS LICENSED ON AN \\\"AS-IS\\\" BASIS. MICROCHIP MAKES NO WARRANTIES OF ANY KIND WITH RESPECT TO THE SOFTWARE, WHETHER EXPRESS, IMPLIED, STAUTORY OR OTHERWISE, AND EXPRESSLY DISCLAIMS ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE OR NON-INFRINGEMENT AND ANY WARRANTIES THAT MAY ARISE FROM USAGE OF TRADE OR COURSE OF DEALING. MICROCHIP AND ITS LICENSORS HAVE NO OBLIGATION TO CORRECT ANY DEFECTS IN THE SOFTWARE. TECHNICAL ASSISTANCE, IF PROVIDED, WILL NOT EXPAND THESE WARRANTIES. IF CUSTOMER IS A CONSUMER, THE ABOVE WILL NOT ACT TO EXCLUDE YOUR STATUTORY RIGHTS. 11. Limited Liability. EXCEPT FOR CONSUMERS TO WHOM SECTION 8 APPLIES, IN NO EVENT WILL MICROCHIP BE LIABLE, WHETHER IN CONTRACT, WARRANTY, REPRESENTATION, TORT, STRICT LIABILITY, INDEMNITY, CONTRIBUTION OR OTHERWISE, FOR ANY INDIRECT, SPECIAL, PUNITIVE, EXEMPLARY, INCIDENTAL OR CONSEQUENTIAL LOSS, DAMAGE, COST OR EXPENSE OF ANY KIND WHATSOEVER, HOWEVER CAUSED, OR ANY LOSS OF PRODUCTION, COST OF PROCUREMENT OF SUBSTITUTE PRODUCTS OR SERVICES, ANY LOSS OF PROFITS, LOSS OF BUSINESS, LOSS OF USE OR LOSS OF DATA, OR INTERRUPTION OF BUSINESS ARISING OUT OF THIS AGREEMENT, HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, EVEN IF MICROCHIP HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH LOSS, AND NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY. MICROCHIP'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT WILL NOT EXCEED USD$1,000. 12. General. (a) This Agreement will be governed by and construed in accordance with the laws of the State of Arizona and the United States, without regard to conflicts of law provisions. The parties hereby irrevocably consent to the exclusive personal jurisdiction and venue of the state and federal courts in Maricopa County, Arizona for any dispute relating to this Agreement. WHERE LICENSEE IS A CONSUMER LOCATED IN EUROPE, this Agreement is subject to the laws of the country in which the Software is downloaded, and, to the extent so mandated by such laws, subject to the jurisdiction of the courts of that country. The parties expressly disclaim the applicability of the United Nations Convention on Contracts for the International Sale of Goods in connection with this Agreement. (b) Unless the parties have a mutually executed agreement relating to the licensing of this Software by Microchip to Licensee (\\\"Signed Agreement\\\"), this Agreement constitutes the entire agreement between the parties with respect to the Software, and supersedes and replaces prior or contemporaneous written or verbal agreements or communications between the parties regarding the Software, including any purchase orders. If the parties have a Signed Agreement, this Agreement does not supersede or replace that Signed Agreement. This Agreement will not be modified except by a written agreement signed by an authorized representative of Microchip. If any provision of this Agreement is held by a court of competent jurisdiction to be illegal, invalid, or unenforceable, that provision will be limited or eliminated to the minimum extent necessary so that this Agreement will otherwise remain in full force and effect and enforceable. No waiver of any breach of any provision of this Agreement constitutes a waiver of any prior, concurrent, or subsequent breach of the same or any other provisions of this Agreement, and no waiver will be effective unless made in writing and signed by an authorized representative of the waiving party. (c) Licensee agrees to comply with all import and export laws and restrictions and regulations of the Department of Commerce or other United States or foreign agency or authority. (d) This Agreement will bind and inure to the benefit of each party's permitted successors and assigns. Licensee may not assign this Agreement in whole or in part, whether by law or otherwise, without Microchip's prior written consent. Any merger, consolidation, amalgamation, reorganization, transfer of all or substantially all assets or other change in control or majority ownership (\\\"Change of Control\\\") is considered an assignment for the purpose of this Section. Any attempt to assign this Agreement without such consent will be null and void. However, Microchip may assign this Agreement to an affiliate, or to another entity in the event of a Change of Control. (e) Licensee acknowledges its breach of any confidentiality or proprietary rights provision of this Agreement would cause Microchip irreparable damage, for which the award of damages would not be an adequate remedy. Licensee, therefore, agrees if Microchip alleges that Licensee has breached or violated any such provisions then Microchip may seek equitable relief, in addition to all other remedies at law or in equity. (f) Authorized representatives of Microchip shall have the right to reasonably inspect Licensee's premises and to audit Licensee's records and inventory of Licensee Products, whether located on Licensee's premises or elsewhere at any time, announced or unannounced, and in its sole and absolute discretion, in order to ensure Licensee's adherence to the terms of this Agreement. (g) Consistent with 48 C.F.R. �12.212 or 48 C.F.R. �227.7202-1 through 227.7202-4, as applicable, the Software is being licensed to U.S. Government end users (i) only as Commercial Items, and (ii) with only those rights as are granted to all other end users pursuant to the terms and conditions of the applicable Microchip licenses. To the extent the Software (or a portion thereof) qualifies as �technical data' as such term is defined in 48 C.F.R. �252.227-7015(a)(5), then its use, duplication, or disclosure by the U.S. Government is subject to the restrictions set forth in subparagraphs (a) through (e) of the Rights in Technical Data clause at 48 C.F.R. �252.227-7015. Contractor/manufacturer is Microchip Technology Inc., 2355 W. Chandler Blvd., Chandler, AZ 85224-6199. Questions about this Agreement should be sent to: Microchip Technology Inc., 2355 W. Chandler Blvd., Chandler, AZ 85224-6199 USA. ATTN: Marketing. v.3.3.2021 . ",
    "url": "http://localhost:4000/motor_control/mplab_harmony_license.html",
    "relUrl": "/mplab_harmony_license.html"
  },"36": {
    "doc": "Non Motor Control Plant Projects",
    "title": "Non- Motor Control Plant Projects",
    "content": "This section briefly describes the control algorithm, software design for non-motor control plant projects. This section also lists the key MCC configuration details for the motor control firmware. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/non_mc_plant.html#non--motor-control-plant-projects",
    "relUrl": "/algorithms/pmsm_foc/non_mc_plant.html#non--motor-control-plant-projects"
  },"37": {
    "doc": "Non Motor Control Plant Projects",
    "title": "Non Motor Control Plant Projects",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/non_mc_plant.html",
    "relUrl": "/algorithms/pmsm_foc/non_mc_plant.html"
  },"38": {
    "doc": "Peripheral Modules",
    "title": "Configuring Peripheral Modules",
    "content": "This section describes how to configure MCU peripherals for motor control application projects with Motor Control Plant . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html#configuring-peripheral-modules",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html#configuring-peripheral-modules"
  },"39": {
    "doc": "Peripheral Modules",
    "title": "Setting PWM Interface",
    "content": "The following section describes the PWM interfaces and how it can be configured using Motor Control Plant. Theoretical Background . The three-phase actuation voltage is applied employing the Space Vector Pulse Width Modulation (SVPWM). Figure shows a conceptual diagram of Analog to digital conversion. The software essentially has to perform following tasks: . | Set the PWM unit and channels to be used to modulate three-phase voltages | Configure PWM peripheral’s frequency, dead-time, fault management etc. | . Configuring PWM Interface using MC Plant . In Motor Control Plant PWM Interface can be set in following steps. | Launch PWM Interface by clicking on the block . | Configure PWM interface . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html#setting-pwm-interface",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html#setting-pwm-interface"
  },"40": {
    "doc": "Peripheral Modules",
    "title": "Setting Position Interface",
    "content": "The following section describes the position interfaces and how it can be configured using Motor Control Plant. Theoretical Background . For sensored Field Oriented Control, the position sensor interface has to be configured to process rotor position signals. The software essentially has to perform following tasks: . | Set the peripheral unit and channels to be used to for rotor position signals | Configure rotor position interface peripheral. | . Configuring Position Interface using MC Plant . | Launch Position Interface by clicking on the block . | Configure PWM interface . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html#setting-position-interface",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html#setting-position-interface"
  },"41": {
    "doc": "Peripheral Modules",
    "title": "Peripheral Modules",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/peripheral_modules.html"
  },"42": {
    "doc": "Permanent Magnet Synchronous Motors",
    "title": "Permanent Magnet Synchronous Motor ",
    "content": "The Permanent Magnet Synchronous Motor (PMSM) is the most preferred choice for motor control applications. Due to their permanent magnet rotor, they also have higher torque with smaller frame size and no rotor current, all of which are advantages over AC Induction Motors (AICMs). With their high power-to-size ratio, PMSMs can help make the design smaller without the loss of torque. These strengths enable the usage of PMSM in a broad range of variable frequency drives (VFDs) applications. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html#permanent-magnet-synchronous-motor-",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html#permanent-magnet-synchronous-motor-"
  },"43": {
    "doc": "Permanent Magnet Synchronous Motors",
    "title": "Construction",
    "content": "Permanent Magnet Synchronous Motor (PMSM) is an AC synchronous motor driven by a three-phase controlled AC supply. Figure 1 shows a split view of a typical PMSM. Figure.1 - Split view of PMSM Motor . The PMSM has a stationary part called the stator; a rotating part called the rotor. The stator consists of three-phase windings. When the stator is excited with a balanced three-phase voltage, it generates a rotating magnetic field. The rotor has implanted permanent magnets on its core and generates the rotor’s magnetic field. The rotor’s magnetic field interacts with the stator’s rotating magnetic field to produce the rotor torque. PMSMs are broadly classified into the following two categories depending upon the rotor construction: . | Surface-mounted ( SPMSM ) | Interior-buried ( IPMSM ) | . The SPMSM has the permanent magnets fixed on the surface of the rotor leading to a symmetrical air-gap reluctance path between the rotor and the stator core. The IPMSM has the permanent magnets inserted inside the rotor core leading to a non-symmetrical air-gap reluctance path between the rotor and the stator core. Figure 2 shows the transversal-sectional view of surface-mounted and interior buried PMSM rotor configurations. Figure.2 - Rotor transversal section . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html#construction",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html#construction"
  },"44": {
    "doc": "Permanent Magnet Synchronous Motors",
    "title": "Mathematical Model ",
    "content": "The effective mathematical model of PMSM is critical for controller and observer design for PMSM based variable frequency drives. Even though PMSMs are inherently non-linear systems, they can be modeled as a simple linear time-invariant dynamical system for controller and observer design in most drive applications. The following section briefly introduces a simple linear dynamical model of the PMSM in the stationary and rotational reference frame . Stationary Reference Frame Model . The following equation represents the stationary model of PMSM: . where is the stator voltage in stationary reference frame; is the stator current in stationary reference frame; is the stator back EMF in stationary reference frame; is the stator per phase resistance. is the inductance when the winding axis is aligned to rotor flux axis; is the inductance when the winding axis orthogonal to rotor flux axis; and is the electrical rotor angle. is the permanent magnet flux linkage; and is the electrical speed of the motor. Rotational Reference Frame Model . The rotational reference frame model of the PMSM is derived by linear transformation of the PMSM stationary frame to a rotating reference frame (Park’s Transformation). The transformation essentially converts all sinusoidally varying components to DC components, thereby making control and analysis using classical control very simple. The step wise process of transformation is beyond the scope of this application note. Hence, the final result of the transformation is only shown. Equation 2.4 shows the rotational reference frame model of PMSM. where is the stator phase voltage in rotating reference frame; is the stator phase current vector in rotating reference frame; is the stator resistance; is the electrical speed of the motor; is the permanent magnet flux linkage; is the rotational matrix. is the inductance when the winding axis is aligned to rotor flux axis; and is the inductance when the winding axis orthogonal to rotor flux axis. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html#mathematical-model-",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html#mathematical-model-"
  },"45": {
    "doc": "Permanent Magnet Synchronous Motors",
    "title": "Permanent Magnet Synchronous Motors",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/pmsm_motor.html"
  },"46": {
    "doc": "PMSM FOC Component",
    "title": "PMSM FOC",
    "content": "PMSM_FOC component provides Field Oriented Control (FOC) algorithm for Permanent Magnet Synchronous Motor (PMSM). This component supports speed control with an inner current control loop to control motor speed and motor current. It also supports current control and open loop mode. Rotor position estimation techniques are configurable in the UI. PMSM_FOC connects to the Peripheral Libraries (PLIBs) from CSP repository and X2CScope component from X2C repository. This component depends on ADC PLIB for phase current measurement, DC bus voltage and potentiometer measurement. PWM PLIB is used to generate three phase signals to control the motor. For quadrature encoder sensor position feedback, PMSM_FOC interacts with QDEC peripheral. In addition to the generation of code, it also provides back-end support for Motor Control Plant. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/readme.html#pmsm-foc",
    "relUrl": "/algorithms/pmsm_foc/readme.html#pmsm-foc"
  },"47": {
    "doc": "PMSM FOC Component",
    "title": "Supported Microcontrollers and Development Boards",
    "content": "| Microcontroller | MCLV2 | MCHV3 | . | SAME70 | Yes | Yes | . | SAME54 | Yes | Yes | . | SAMC21 | Yes | Yes | . | PIC32MK MCF | Yes | Yes | . | PIC32MK MCM | Yes | Yes | . | PIC32CM MC | Yes | Yes | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/readme.html#supported-microcontrollers-and-development-boards",
    "relUrl": "/algorithms/pmsm_foc/readme.html#supported-microcontrollers-and-development-boards"
  },"48": {
    "doc": "PMSM FOC Component",
    "title": "Motor Control Plant",
    "content": "The Motor Control Plant Configurator (MCPC) is an extension of the MPLAB® ecosystem for developing Microchip’s next-generation application firmware for motor control on Microchip® 32-bit devices. It has a graphical tool that enables an effortless configuration and generation of motor control application C code for Microchip 32-bit devices. The details of the tool is available at Motor Control Plant. The following table summarizes the supported Microchip’s 32-bit MCUs in MC Plant: . | Device Families | Links | . | PIC32MK | PIC32MK Family | . | SAM E5x | SAME5x Family | . | SAM E7x | SAME7x Family | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/readme.html#motor-control-plant",
    "relUrl": "/algorithms/pmsm_foc/readme.html#motor-control-plant"
  },"49": {
    "doc": "PMSM FOC Component",
    "title": "PMSM FOC Component for devices without MC Plant support",
    "content": "This section describes the software design, algorithm and configuration options for those devices which do not have MC Plant support yet. The following table shows the supported features with PMSM FOC Component. Software Design . Control Algorithm . Configuring the Library . Using the Library . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/readme.html#pmsm-foc-component-for-devices-without-mc-plant-support",
    "relUrl": "/algorithms/pmsm_foc/readme.html#pmsm-foc-component-for-devices-without-mc-plant-support"
  },"50": {
    "doc": "PMSM FOC Component",
    "title": "PMSM FOC Component",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/readme.html",
    "relUrl": "/algorithms/pmsm_foc/readme.html"
  },"51": {
    "doc": "Motor Control Application Repositories",
    "title": "Motor Control Application Repositories",
    "content": "Microchip MPLAB Harmony provides several motor control application examples for Microchip’s 32-bit device families designed for motor control applications. See the following repositories under Microchip-MPLAB-Harmony Github project for specific applications examples: . | Repository | Product family | . | mc_apps_pic32mk | Motor Control Application examples for: PIC32MK GENERAL PURPOSE AND MOTOR CONTROL (GP/MC) family PIC32MK GENERAL PURPOSE AND MOTOR CONTROL (GPK/MCM) WITH CAN FD family | . | mc_apps_sam_c2x | Motor Control Application examples for SAM C20/C21 Family | . | mc_apps_sam_d5x_e5x | Motor Control Application examples for SAM D5x/E5x family | . | mc_apps_sam_e7x_s7x_v7x | Motor Control Application examples for SAM E70/S70/V70/V71 Family | . | mc_apps_sam_rh71 | Motor Control Application examples for SAMRH71 family | . | mc_apps_pic32cm_mc | Motor Control Application examples for PIC32CM MC 00 family | . ",
    "url": "http://localhost:4000/motor_control/apps/readme.html",
    "relUrl": "/apps/readme.html"
  },"52": {
    "doc": "Release notes",
    "title": "Microchip MPLAB Harmony 3 Release Notes",
    "content": " ",
    "url": "http://localhost:4000/motor_control/release_notes.html#microchip-mplab-harmony-3-release-notes",
    "relUrl": "/release_notes.html#microchip-mplab-harmony-3-release-notes"
  },"53": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.8.0",
    "content": "New Features . | Added Motor Control Plant support for PMSM_FOC_Component for SAM E70, SAM E54 and PIC32MK devices | . Known Issues . | same as v3.7.0 | . Required MPLAB Harmony v3 Modules . | csp v3.11.0 | bsp v3.11.0 | x2c v1.2.0 | dev_packs v3.11.0 | mcc v1.0.9 | . Development Tools . | MPLAB X IDE v6.00 | MPLAB XC32 C/C++ Compiler v4.00 | MPLAB X IDE plug-ins: . | MPLAB Code Configurator (MCC) v5.1.1 | X2CScope v1.3.0. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v380",
    "relUrl": "/release_notes.html#motor-control-release-v380"
  },"54": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.7.0",
    "content": "New Features . | SAMC2x and PIC32CM MC device support - Added Reduced Order Leuemberger Observer on SAMC21 and PIC32CM MC devices in PMSM_FOC component. | Added open loop support in encoder based FOC | Supported user input for speed reference and current reference | . Known Issues . | In pmsm_foc_encoder_pic32_mk projects, overcurrent fault occurs at higher speeds in reverse direction with field weakening mode enabled. | Isolated EDBG Card . | If programming failure occurs with message “java.lang.RuntimeException:RDDI_DAP_OPERATION_FAILED”, then reset the Isolated EDBG Card’s configuration by Go to File -&gt; Project Properties -&gt; EDBG -&gt; Reset . | Programming or debugging PIC32CM, SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | . | pmsm_foc_encoder_ applications running on dsPICDEM MCHV-3 requires increasing bandwidth of the quadrature encoder signal filter to maintain signal integrity of quadrature sensor signals at higher motor speeds. Without these modifications, motor operation may fail at higher speeds. | Reduce the capacitance value of C25, C26 and C27 from 100pF to 10pF 50V NPO 0805 | . | . Required MPLAB Harmony v3 Modules . | csp v3.9.1 | x2c v1.1.4 | dev_packs v3.9.0 | mhc v3.8.0 | . Development Tools . | MPLAB X IDE v5.50 | MPLAB XC32 C/C++ Compiler v3.01 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.6.4. | X2CScope v1.3.0. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v370",
    "relUrl": "/release_notes.html#motor-control-release-v370"
  },"55": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.6.1",
    "content": "Bug Fixes . | Fixed issues to support XC32 compiler v3.00 | . Known Issues . | Same as v3.6.0 | . Development Tools . | MPLAB X IDE v5.45 | MPLAB XC32 C/C++ Compiler v3.00 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.6.2. | X2CScope v1.3.0. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v361",
    "relUrl": "/release_notes.html#motor-control-release-v361"
  },"56": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.6.0",
    "content": ". | PMSM_FOC Component . Following features were added to PMSM_FOC component . | SAME5x device support | dsPICDEM MCHV-3 board support | Flying Start support | . | Application Examples . All motor control application examples were moved to product family specific motor control apps repositories. | . Required MPLAB Harmony v3 Modules . | csp v3.8.3 | x2c v1.1.3 | dev_packs v3.8.0 | mhc v3.6.5 | . Known Issues . | ATSAME54 Motor Control Plugin Module based demos may see noise coupling on the ADC channels resulting in motor instability/stall. | This issue can be resolved by ensuring that R1 (0 ohm) resistor is populated. | . | Isolated EDBG Card . | If programming failure occurs with message “java.lang.RuntimeException:RDDI_DAP_OPERATION_FAILED”, then reset the Isolated EDBG Card’s configuration by Go to File -&gt; Project Properties -&gt; EDBG -&gt; Reset . | Programming or debugging PIC32CM, SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | . | pmsm_foc_encoder_ applications running on dsPICDEM MCHV-3 requires increasing bandwidth of the quadrature encoder signal filter to maintain signal integrity of quadrature sensor signals at higher motor speeds. Without these modifications, motor operation may fail at higher speeds. | Reduce the capacitance value of C25, C26 and C27 from 100pF to 10pF 50V NPO 0805 | . | pmsm_foc_rolo_1shunt may experience false over-current faults during alternate motor start command when operated in “TORQUE_MODE”. Workaround - Reset the MCU before re-starting the motor in “TORQUE_MODE”. | For any demos running on ATSAMC21 Motor Control PIM, if any failures are observed while trying to use X2CScope, these failures may occur due to shortage of CPU computation bandwidth. In such cases, enable “RAM_EXECUTE” mode which speeds up execution by executing certain functions from RAM memory instead of Flash memory. | . Development Tools . | MPLAB X IDE v5.45 | MPLAB XC32 C/C++ Compiler v2.50 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.6.2. | X2CScope v1.3.0. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v360",
    "relUrl": "/release_notes.html#motor-control-release-v360"
  },"57": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.5.1",
    "content": "New Applications . | The following table provides the list of algorithms added in this release. | . | Algorithm | Description | Control Board | Inverter Board | . | pmsm_foc_rolo_pic32_cm_mc | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer | PIC32CM MC 00 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; &lt;li&gt;dsPICDEM™ MCHV-3 Support&lt;/li&gt; | . | acim_vhz_pic32_cm_mc | Open Loop V/F Control of AC Induction Motor | PIC32CM MC 00 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCHV-3 Support&lt;/li&gt; | . | bldc_bc_hall_pic32_cm_mc | Block Commutation based control of BLDC motor using Hall Sensors | PIC32CM MC 00 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; | . Updated Applications . | Application | Description | Control Board | Inverter Board | Revision History | . | pmsm_foc_encoder_lx7720_sam_rh71_ek | Sensored Field Oriented Control of PMSM using SAMRH71 MCU and LX7720 Motor Driver and Position decoder | SAMRH71F20-EK Evaluation Kit | LX7720 Daughter Board | &lt;li&gt; Regenerated demo applications using csp v3.8.1 &lt;/li&gt;&lt;li&gt;Added reverse direction capability&lt;/li&gt;&lt;li&gt; Optimized Speed Controller response &lt;/li&gt; | . Required MPLAB Harmony v3 Modules . | csp v3.8.1 | x2c v1.1.2 | dev_packs v3.8.0 | mhc v3.5.1 | . Known Issues . | Isolated EDBG Card . | This board is not supported in MPLABX v5.40. We recommend using MPLABX v5.45 or above for programming/debugging any PIC32CM_MC, SAM C/D2x, SAM D/E5x and SAM E/V/S7x applications dsPICDEM™ MCHV-3 High Voltage Development Board . | If programming failure occurs with message “java.lang.RuntimeException:RDDI_DAP_OPERATION_FAILED”, then reset the Isolated EDBG Card’s configuration by Go to File -&gt; Project Properties -&gt; EDBG -&gt; Reset . | Programming or debugging PIC32CM, SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | . | pmsm_foc_encoder_ applications running on dsPICDEM MCHV-3 requires increasing bandwidth of the quadrature encoder signal filter to maintain signal integrity of quadrature sensor signals at higher motor speeds. Without these modifications, motor operation may fail at higher speeds. | Reduce the capacitance value of C25, C26 and C27 from 100pF to 10pF 50V NPO 0805 | . | pmsm_foc_rolo_1shunt may experience false over-current faults during alternate motor start command when operated in “TORQUE_MODE”. Workaround - Reset the MCU before re-starting the motor in “TORQUE_MODE”. | For any demos running on ATSAMC21 Motor Control PIM, if any failures are observed while trying to use X2CScope, these failures may occur due to shortage of CPU computation bandwidth. In such cases, enable “RAM_EXECUTE” mode which speeds up execution by executing certain functions from RAM memory instead of Flash memory. | . Development Tools . | MPLAB X IDE v5.45 | MPLAB XC32 C/C++ Compiler v2.41 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.6.0. | X2CScope v1.3.0. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v351",
    "relUrl": "/release_notes.html#motor-control-release-v351"
  },"58": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.5.0",
    "content": "New Features . | Feature | Description | Supported Device Family | . | PMSM_FOC Component | An application library for Field Oriented Control (FOC) of Permanent Magnet Synchronous Motors (PMSM). This library can be configured using MPLAB Harmony Configurator (MHC) to auto-generate a fully functional application code which can drive a permanent magnet synchronous motor. | PIC32MK, SAME7x | . New Applications . | The following table provides the list of algorithms added in this release. | . | Algorithm | Description | Control Board | Inverter Board | . | pmsm_foc_encoder_pic32_mk | Sensored Field Oriented Control of PMSM using Quadrature Encoder | PIC32MK MCM Motor Control Plugin Module | dsPICDEM™ MCLV-2 Support | . | pmsm_foc_pll_estimator_pic32_mk | Sensorless Field Oriented Control of PMSM using PLL Estimator | PIC32MK MCM Motor Control Plugin Module | dsPICDEM™ MCLV-2 Support | . | pmsm_foc_encoder_lx7720_sam_rh71_ek | Sensored Field Oriented Control of PMSM using SAMRH71 MCU and LX7720 Motor Driver and Position decoder | SAMRH71F20-EK Evaluation Kit | LX7720 Daughter Board | . Updated Applications . | All demo applications were regenerated using csp v3.7.1 | Following table lists the applications which are updated beyond regeneration using csp v3.7.1. | . | Application | Description | Control Board | Inverter Board | Revision History |   | . | pmsm_foc_encoder_pic32_mk | Sensored Field Oriented Control of PMSM using Quadrature Encoder | PIC32MK Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; | &lt;li&gt; Regenerated low voltage demo (MCLV2) using PMSM_FOC component&lt;/li&gt; |   | . | pmsm_foc_pll_estimator_pic32_mk | Sensorless Field Oriented Control of PMSM using PLL Estimator | PIC32MK Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; | &lt;li&gt; Regenerated low voltage demo (MCLV2) using PMSM_FOC component&lt;/li&gt; | &lt;li&gt; Regenerated low voltage demo (MCLV2) using PMSM_FOC component&lt;/li&gt; | . | pmsm_foc_encoder_sam_e70 | Sensored Field Oriented Control of PMSM using Quadrature Encoder | ATSAME70 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; | &lt;li&gt; Regenerated low voltage demo (MCLV2) using PMSM_FOC component&lt;/li&gt; |   | . | pmsm_foc_pll_estimator_sam_e70 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME70 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; | &lt;li&gt; Regenerated low voltage demo (MCLV2) using PMSM_FOC component&lt;/li&gt; | &lt;li&gt; Regenerated low voltage demo (MCLV2) using PMSM_FOC component&lt;/li&gt; | . | pmsm_foc_rolo_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer | ATSAMC21 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; &lt;li&gt;dsPICDEM™ MCHV-3 Support&lt;/li&gt; | &lt;li&gt; Implemented bug fix to use the most recent phase current measurement for current control &lt;/li&gt;&lt;li&gt; Implemented bug fix in integral saturation logic (upper limit) of the PI compensator &lt;/li&gt; |   | . | pmsm_foc_rolo_wm_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Windmilling Capability | ATSAMC21 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; &lt;li&gt;dsPICDEM™ MCHV-3 Support&lt;/li&gt; | &lt;li&gt; Implemented bug fix to use the most recent phase current measurement for current control &lt;/li&gt;&lt;li&gt; Implemented bug fix in integral saturation logic (upper limit) of the PI compensator &lt;/li&gt; |   | . | pmsm_foc_rolo_fw_mtpa_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Field Weakening and MTPA Capability | ATSAMC21 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; | &lt;li&gt; Implemented bug fix to use the most recent phase current measurement for current control &lt;/li&gt;&lt;li&gt; Implemented bug fix in integral saturation logic (upper limit) of the PI compensator &lt;/li&gt; |   | . | acim_vhz_sam_c21 | Open Loop V/F Control of AC Induction Motor | ATSAMC21 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCHV-3 Support&lt;/li&gt; | &lt;li&gt; Implemented bug fix in integral saturation logic (upper limit) of the PI compensator &lt;/li&gt; |   | . | pmsm_foc_rolo_1shunt | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Single Shunt Current Sense | ATSAMC21 Motor Control Plugin Module | &lt;li&gt;dsPICDEM™ MCLV-2 Support&lt;/li&gt; | &lt;li&gt; Implemented bug fix in integral saturation logic (upper limit) of the PI compensator &lt;/li&gt; |   | . Required MPLAB Harmony v3 Modules . | csp v3.7.1 | x2c v1.0.1 | dev_packs v3.7.0 | mhc v3.5.0 | . Known Issues . | Isolated EDBG Card (board revision #02-10824-R1) is not supported in MPLABX v5.40. We recommend using MPLABX v5.35 for programming/debugging any SAM C/D2x, SAM D/E5x and SAM E/V/S7x applications dsPICDEM™ MCHV-3 High Voltage Development Board | MPLAB X IDE v5.35 fails to program ATSAME70 Motor Control Plugin Module on dsPICDEM™ MCHV-3 High Voltage Development Board. In order to resolve this issue, implement the following change in dap_cortex-m7.py, located at C:\\\\Program Files (x86)\\\\Microchip\\\\MPLABX\\v5.35\\\\packs\\\\Microchip\\SAME70_DFP\\4.2.59\\\\scripts\\\\ . | Goto line # 2, replace “comm_speed=8000000” with “comm_speed=2000000” | . | Programming or debugging SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | pmsm_foc_encoder_ applications running on dsPICDEM MCHV-3 requires increasing bandwidth of the quadrature encoder signal filter to maintain signal integrity of quadrature sensor signals at higher motor speeds. Without these modifications, motor operation may fail at higher speeds. | Reduce the capacitance value of C25, C26 and C27 from 100pF to 10pF 50V NPO 0805 | . | pmsm_foc_rolo_1shunt may experience false over-current faults during alternate motor start command when operated in “TORQUE_MODE”. Workaround - Reset the MCU before re-starting the motor in “TORQUE_MODE”. | For any demos running on ATSAMC21 Motor Control PIM, if any failures are observed while trying to use X2CScope, these failures may occur due to shortage of CPU computation bandwidth. In such cases, enable “RAM_EXECUTE” mode which speeds up execution by executing certain functions from RAM memory instead of Flash memory. | . Development Tools . | MPLAB X IDE v5.40 | MPLAB XC32 C/C++ Compiler v2.41 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.5.0. | X2CScope v1.3.0. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v350",
    "relUrl": "/release_notes.html#motor-control-release-v350"
  },"59": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.4.1",
    "content": "Updated Applications . | The following table provides the list of applications updated in this release. | . | Application | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | Revision History | . | pmsm_foc_encoder_pic32_mk | Sensored Field Oriented Control of PMSM using Quadrature Encoder | PIC32MK Motor Control Plugin Module | Yes | Yes | &lt;li&gt; PWM to Control Frequency was made 1:1 in Low Voltage Demo (MCLV-2) &lt;/li&gt;&lt;li&gt; Added High Voltage Support (MCHV-3)&lt;/li&gt; | . | pmsm_foc_pll_estimator_pic32_mk | Sensorless Field Oriented Control of PMSM using PLL Estimator | PIC32MK Motor Control Plugin Module | No | Yes | Added High Voltage Support (MCHV-3) | . Required MPLAB Harmony v3 Modules . | csp v3.5.0 | dev_packs v3.5.0 | mhc v3.3.0 | . Known Issues . | Programming or debugging SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | pmsm_foc_rolo_1shunt may experience false over-current faults during alternate motor start command when operated in “TORQUE_MODE”. Workaround - Reset the MCU before re-starting the motor in “TORQUE_MODE”. | For any demos running on ATSAMC21 Motor Control PIM, if any failures are observed while trying to use X2CScope, these failures may occur due to shortage of CPU computation bandwidth. In such cases, kindly enable “RAM_EXECUTE” mode which speeds up execution by executing certain functions from RAM memory instead of Flash memory | . Development Tools . | MPLAB X IDE v5.25 | MPLAB XC32 C/C++ Compiler v2.30 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.3.0. | X2CScope v1.2.3. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v341",
    "relUrl": "/release_notes.html#motor-control-release-v341"
  },"60": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.4.0",
    "content": "New Algorithms . | The following table provides the list of algorithms added in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | . | pmsm_foc_encoder_pic32_mk | Sensored Field Oriented Control of PMSM using Quadrature Encoder | PIC32MK Motor Control Plugin Module | No | Yes | . | pmsm_foc_pll_estimator_pic32_mk | Sensorless Field Oriented Control of PMSM using PLL Estimator | PIC32MK Motor Control Plugin Module | No | Yes | . | pmsm_foc_smo_sam_e70 | Sensorless Field Oriented Control of PMSM using Sliding Mode Observer | ATSAME70 Motor Control Plugin Module | No | Yes | . | pmsm_foc_rolo_1shunt | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Single Shunt Current Sense | ATSAMC21 Motor Control Plugin Module | No | Yes | . Updated Algorithms . | The following table provides the list of algorithms updated in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | Revision History | . | pmsm_foc_encoder_sam_e70 | Sensored Field Oriented Control of PMSM using PDEC | ATSAME70 Motor Control Plugin Module | Yes | Yes | &lt;li&gt; Added motor start/stop Capability without resetting the MCU&lt;/li&gt; &lt;li&gt; Added Field Weakening support on low voltage application (MCLV-2)&lt;/li&gt;&lt;li&gt; Added MCHV-3 support (without Field Weakening)&lt;/li&gt; | . | pmsm_foc_pll_estimator_sam_e70 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME70 Motor Control Plugin Module | Yes | Yes | &lt;li&gt; Reduced dead-time in High Voltage demo (MCHV-3) to improve open loop to closed loop transition&lt;/li&gt;&lt;li&gt; Resolved bug in Field Weakening operation in reverse direction&lt;/li&gt; | . | pmsm_foc_encoder_sam_e54 | Sensored Field Oriented Control of PMSM using Quadrature Encoder | ATSAME54 Motor Control Plugin Module | Yes | Yes | &lt;li&gt;Added Field Weakening support on low voltage application (MCLV-2) &lt;/li&gt;&lt;li&gt; Added MCHV-3 Support (without field weakening support) &lt;/li&gt; | . | pmsm_foc_encoder_position_sam_e54 | FOC based Position Control of PMSM using Quadrature Encoder | ATSAME54 Motor Control Plugin Module | Yes | Yes | &lt;li&gt; Replaced the PI type Compensator in the position loop with P type Compensator&lt;/li&gt;&lt;li&gt; Added MCHV-3 Support &lt;/li&gt; | . | pmsm_foc_pll_estimator_sam_e54 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME54 Motor Control Plugin Module | Yes | Yes | &lt;li&gt; Unswapped PWMH and PWML output in TCC0 configuration &lt;/li&gt;&lt;li&gt; Update PWM Duty Cycle Update implementation to accomodate for unswapping of the PWMH and PWML&lt;/li&gt;&lt;li&gt;Over-current fault was made recoverable i.e. Motor can be re-started after an over-current fault without resetting the MCU&lt;/li&gt; | . | pmsm_foc_rolo_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer | ATSAMC21 Motor Control Plugin Module | Yes | Yes | &lt;li&gt;Over-current fault was made recoverable i.e. Motor can be re-started after an over-current fault without resetting the MCU&lt;/li&gt; | . | pmsm_foc_rolo_wm_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Windmilling Capability | ATSAMC21 Motor Control Plugin Module | Yes | Yes | &lt;li&gt;Over-current fault was made recoverable i.e. Motor can be re-started after an over-current fault without resetting the MCU&lt;/li&gt;&lt;li&gt; Fixed Speed Filter implementation to make it direction agnostic | . Required MPLAB Harmony v3 Modules . | csp v3.5.0 | dev_packs v3.5.0 | mhc v3.3.0 | . Known Issues . | Programming or debugging SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | pmsm_foc_rolo_1shunt may experience false over-current faults during alternate motor start command when operated in “TORQUE_MODE”. Workaround - Reset the MCU before re-starting the motor in “TORQUE_MODE”. | For any demos running on ATSAMC21 Motor Control PIM, if any failures are observed while trying to use X2CScope, these failures may occur due to shortage of CPU computation bandwidth. In such cases, kindly enable “RAM_EXECUTE” mode which speeds up execution by executing certain functions from RAM memory instead of Flash memory | . Development Tools . | MPLAB X IDE v5.25 | MPLAB XC32 C/C++ Compiler v2.30 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.3.0. | X2CScope v1.2.3. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v340",
    "relUrl": "/release_notes.html#motor-control-release-v340"
  },"61": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.3.1",
    "content": "Updated Algorithms . | The following table provides the list of algorithms updated in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | Revision History | . | pmsm_foc_pll_estimator_sam_e54 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME54 Motor Control Plugin Module | Yes | Yes | Added Windmilling (On-the-fly Startup) Support | . | pmsm_foc_rolo_fw_mtpa_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Field Weakening and MTPA Capability | ATSAMC21 Motor Control Plugin Module | No | Yes | Fixed error in MTPA calculation | . | pmsm_foc_pll_estimator_sam_e70 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME70 Motor Control Plugin Module | Yes | Yes | Added Bi-directional Support | . Required MPLAB Harmony v3.3.0 Modules . | csp v3.3.0 | dev_packs v3.3.0 | mhc v3.3.0 | . Known Issues . | Programming or debugging SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | . Development Tools . | MPLAB X IDE v5.20 | MPLAB XC32 C/C++ Compiler v2.15 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.3.0. | X2CScope v1.2.3. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v331",
    "relUrl": "/release_notes.html#motor-control-release-v331"
  },"62": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.3.0",
    "content": "New Algorithms . | The following table provides the list of algorithms added in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | . | pmsm_pfc_foc_pll_estimator_sam_e70 | PFC and Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME70 Motor Control Plugin Module | Yes | No | . | pmsm_foc_rolo_fw_mtpa_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Field Weakening and MTPA Capability | ATSAMC21 Motor Control Plugin Module | No | Yes | . | bldc_bc_hall_sam_c21 | Block Commutation based control of BLDC motor using Hall Sensors | ATSAMC21 Motor Control Plugin Module | No | Yes | . | pmsm_foc_pll_estimator_sam_e54 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME54 Motor Control Plugin Module | Yes | Yes | . | pmsm_foc_encoder_sam_e54 | Sensored Field Oriented Control of PMSM using Quadrature Encoder | ATSAME54 Motor Control Plugin Module | No | Yes | . | pmsm_foc_encoder_position_sam_e54 | FOC based Position Control of PMSM using Quadrature Encoder | ATSAME54 Motor Control Plugin Module | No | Yes | . Updated Algorithms . | The following table provides the list of algorithms updated in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | Revision History | . | pmsm_foc_rolo_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer | ATSAMC21 Motor Control Plugin Module | Yes | Yes | Regenerated application with csp v3.3.0 | . | pmsm_foc_rolo_wm_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Windmilling Capability | ATSAMC21 Motor Control Plugin Module | Yes | Yes | Regenerated application with csp v3.3.0 | . | acim_vhz_sam_c21 | Open Loop V/F Control of AC Induction Motor | ATSAMC21 Motor Control Plugin Module | Yes | No | Regenerated application with csp v3.3.0 | . | pmsm_foc_pll_estimator_sam_e70 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME70 Motor Control Plugin Module | Yes | Yes | Regenerated application with csp v3.3.0. Temporarily removed Field Weakening Support, to be added in future release. | . | pmsm_foc_encoder_sam_e70 | Sensored Field Oriented Control of PMSM using PDEC | ATSAME70 Motor Control Plugin Module | No | Yes | Regenerated application with csp v3.3.0 and added ability to spin the motor in both directions. | . Required MPLAB Harmony v3.3.0 Modules . | csp v3.3.0 | dev_packs v3.3.0 | mhc v3.3.0 | . Known Issues . | Programming or debugging SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | . Development Tools . | MPLAB X IDE v5.20 | MPLAB XC32 C/C++ Compiler v2.15 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.3.0. | X2CScope v1.2.3. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v330",
    "relUrl": "/release_notes.html#motor-control-release-v330"
  },"63": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.2.0",
    "content": "New Algorithms . | The following table provides the list of algorithms added in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | . | pmsm_foc_rolo_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer | ATSAMC21 Motor Control Plugin Module | Yes | Yes | . | pmsm_foc_rolo_wm_sam_c21 | Sensorless Field Oriented Control of PMSM using Reduced Order Luenberger Observer with Windmilling Capability | ATSAMC21 Motor Control Plugin Module | Yes | Yes | . | acim_vhz_sam_c21 | Open Loop V/F Control of AC Induction Motor | ATSAMC21 Motor Control Plugin Module | Yes | No | . Updated Algorithms . | The following table provides the list of algorithms updated in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | Revision History | . | pmsm_foc_pll_estimator_sam_e70 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME70 Motor Control Plugin Module | Yes | Yes | Regenerated application with csp v3.2.0 | . | pmsm_foc_encoder_sam_e70 | Sensored Field Oriented Control of PMSM using PDEC | ATSAME70 Motor Control Plugin Module | No | Yes | Regenerated application with csp v3.2.0 and added ability to spin the motor in both directions. | . Required MPLAB Harmony v3.2.0 Modules . | csp v3.2.0 | dev_packs v3.2.0 | mhc v3.2.0 | . Known Issues . | MPLAB X IDE v5.15 fails to program ATSAME70 Motor Control Plugin Module on dsPICDEM™ MCHV-3 High Voltage Development Board. In order to resolve this issue, implement the following change in dap_cortex-m7.py, located at C:\\\\Program Files (x86)\\\\Microchip\\\\MPLABX\\v5.15\\\\packs\\\\Microchip\\SAME70_DFP\\3.0.10\\\\scripts\\\\ . | Goto line # 197, replace dap.Connect(True, 8000000L) with dap.Connect(True, 2000000L) | . | Programming or debugging SAM C/D2x or SAM D/E5x MCU, using Isolated EDBG Card (board revision #02-10824-R1) on dsPICDEM™ MCHV-3 High Voltage Development Board may inhibit MCU from executing instructions if the MCU is reset by pressing on board ‘Reset’ switch or power cycling the board. Refer to the Isolated EDBG Debugger Product Change Notice for details of hardware modification needed to resolve this issue. | . Development Tools . | MPLAB X IDE v5.15 | MPLAB XC32 C/C++ Compiler v2.15 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.2.0. | X2CScope v1.2.3. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v320",
    "relUrl": "/release_notes.html#motor-control-release-v320"
  },"64": {
    "doc": "Release notes",
    "title": "Motor Control Release v3.1.0",
    "content": "New Algorithms . | The following table provides the list of algorithms added in this release. | . | Algorithm | Description | Supported Plug In Module | dsPICDEM™ MCHV-3 Support | dsPICDEM™ MCLV-2 Support | . | pmsm_foc_pll_estimator_sam_e70 | Sensorless Field Oriented Control of PMSM using PLL Estimator | ATSAME70 Motor Control Plugin Module | Yes | Yes | . | pmsm_foc_encoder_sam_e70 | Sensored Field Oriented Control of PMSM using PDEC | ATSAME70 Motor Control Plugin Module | No | Yes | . Required MPLAB Harmony v3.1.0 Modules . | csp v3.1.0 | dev_packs v3.1.0 | mhc v3.1.0 | . Known Issues . | None. | . Development Tools . | MPLAB X IDE v5.10 | MPLAB XC32 C/C++ Compiler v2.15 | MPLAB X IDE plug-ins: . | MPLAB Harmony Configurator (MHC) v3.1.0. | X2CScope v1.2.3. | . | . ",
    "url": "http://localhost:4000/motor_control/release_notes.html#motor-control-release-v310",
    "relUrl": "/release_notes.html#motor-control-release-v310"
  },"65": {
    "doc": "Release notes",
    "title": "Release notes",
    "content": ". ",
    "url": "http://localhost:4000/motor_control/release_notes.html",
    "relUrl": "/release_notes.html"
  },"66": {
    "doc": "Rotor Position Calculation",
    "title": "Rotor Position Sensing ",
    "content": "The rotor position information is crucial to control the torque of the motor of an electric drive with Field Oriented Control. The following section describes different rotor position measurement technique in an electric drive, and how it can be configured with Motor Control Plant. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/rotor_position_measurement.html#rotor-position-sensing-",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/rotor_position_measurement.html#rotor-position-sensing-"
  },"67": {
    "doc": "Rotor Position Calculation",
    "title": "Rotor Position Sensing Technique ",
    "content": "Rotor position measurement technique can be broadly classified into sensored techniques and sensorless techniques. The sensored techniques uses actual physical sensors to determine the rotor position, whereas sensorless techniques uses estimators or state observers with phase currents and voltages as inputs to determine the rotor angle. Figure 1 shows different measurement rotor position sensing technique used in electric drives. Figure.1 - Rotor Position Sensing Techniques . In this article, we will focus on the few of the popular rotor position measurement techniques, and how to configure them with Motor Control Plant. Quadrature Encoder . Quadrature encoders, also known as incremental encoders or optical encoders, detect position and speed of rotating motion systems. A typical quadrature encoder includes a slotted wheel attached to the shaft of the motor and an emitter/detector module that senses the slots in the wheel. Typically, three output channels, Phase A (QEAx), Phase B (QEBx) and Index (INDXx), provide information on the movement of the motor shaft, including distance and direction. The Phase A and Phase B channels have a unique relationship. If Phase A leads Phase B, the direction of the motor is deemed positive, or forward. If Phase A lags Phase B, the direction of the motor is deemed negative or reverse. The Index pulse occurs once per mechanical revolution and is used as a reference to indicate an absolute position. For a relative timing diagram of these three signals, refer to Figure 1. The quadrature signals produced by the encoder can have four unique states (01, 00, 10 and 11) that reflect the relationship between QEAx and QEBx. Figure 1 shows these states for one count cycle. The order of the states reverses when the direction of travel changes. The quadrature decoder increments or decrements the 16-bit Up/Down Counter (POSxCNT) for each change of state. The counter increments when QEAx leads QEBx and decrements when QEBx leads QEAx. For more details refer AN2757 . Figure.1 - Quadrature Encoder . Back EMF with PLL . The Back EMF with PLL is a technique where the BEMF is used to estimate speed and position. It is based on the principle that when the stator and rotor magnetic fluxes are orthogonal to each other, the BEMF across the d-axis is ‘0’. The PLL is used to drive d-axis BEMF to zero, thereby estimating the rotor position and speed. For more details refer AN2520 . Reduced Order Luenberger Observer . The Reduced Order Luenberger Observer (ROLO) belongs to a class of linear observers used to estimate the internal state of an observable system based on the measured input and output. The ROLO is used to estimate the back EMFs of the PMSM. The BEMF vector position is found with an arctan() operation from the BEMF components, which is then used to estimate the rotor position angle. For more details refer AN2590 . Sliding Mode Observer . The Sliding Mode Observers (SMO) belongs to a class of non-linear observers used to estimate the internal state of an observable system based on the measured input and output. The SMO is used to estimate the back EMFs of the PMSM. The BEMF vector position is found with an arctan() operation from the BEMF components, which is then used to estimate the rotor position angle. For more details refer AN4398 . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/rotor_position_measurement.html#rotor-position-sensing-technique-",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/rotor_position_measurement.html#rotor-position-sensing-technique-"
  },"68": {
    "doc": "Rotor Position Calculation",
    "title": "Rotor Position Calculation",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/rotor_position_measurement.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/rotor_position_measurement.html"
  },"69": {
    "doc": "Implementation Details",
    "title": "Field Oriented Control Implementation",
    "content": "The generated code from the Motor Control Plant intends to achieve following goals: . | to spin a motor based on simple user inputs | to be modular and maintainable | to be a clear example to Microchip customers for a motor control Application using Microchip’s 32 bit MCU devices | . The following section describes an overview of control software architecture to meet the above mentioned goals. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#field-oriented-control-implementation",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#field-oriented-control-implementation"
  },"70": {
    "doc": "Implementation Details",
    "title": "Software Description (In Brief)",
    "content": "The software spins a motor using a velocity control loop, with an inner current loop using field-oriented control (FOC) to manage motor current and torque. Sensorless estimation techniques are used to estimate motor position for commutation and velocity control. User input is provided with a potentiometer and buttons to start and stop the motor, or to reverse direction. A state machine is used to control the transitions between these different modes of operation. The motor startup process involves so-called “open-loop” operation. When the motor is at rest or moving very slowly, the sensorless estimator is not accurate enough; instead, a special set of states is provided to manage startup, in which commutation is forced at a desired acceleration rate, and the velocity control loop is disabled. Figure XX shows a high level block diagram of the software. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#software-description-in-brief",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#software-description-in-brief"
  },"71": {
    "doc": "Implementation Details",
    "title": "Software Architecture",
    "content": "The software performs following tasks: . | Microcontroller and motor control peripheral initialization | FOC State machine in ADC ISR | Motor start and stop command by GPIO button | Motor speed command from potentiometer | . Motor control peripheral initialization. On power-on reset, the software initializes the microcontroller and motor control peripherals according to the user requirements. Motor control state machine . The software implements the motor control tasks in ADC ISR. The ADC ISR incorporates following states: . | Idle. In this state, the motor does not spin. The software waits for a valid button press from the user to start the motor. | Start-up. In this state, the software executes the PMSM start-up procedure as described in section 4.1. | Close-loop speed control. In this state, the software executes an SMO based sensorless FOC. | . Motor speed command from potentiometer . The software calculates the speed reference from the measured from the potentiometer input. Motor start and stop Command by GPIO . The software polls the GPIO button every 10ms to check if the button has been pressed. If the button press is detected, the firmware changes the motor control state from “Idle” to “Start-up” to initiate the motor spin at the specified reference speed. Figure 5.2 illustrates the software flow-chart of the example project . Figure 5.3. Software Flow Chart . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#software-architecture",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#software-architecture"
  },"72": {
    "doc": "Implementation Details",
    "title": "Modules and Components",
    "content": "The software is based on a modular design, and consists of a number of components that work together. The software contains following modules: . | Hardware Abstraction: . | mc_hardware_abstraction.c | mc_hardware_abstraction.h | . | Motor control API . | mc_pmsm_foc.c | mc_pmsm_foc.h | . | Function coordination . | mc_function_coordinator.c | mc_function_coordinator.h | . | Motor control . | State Machine . | mc_motor_control.c | mc_motor_control.h | . | Speed control . | mc_speed_control.c | mc_speed_control.h | . | Current control . | mc_current_control.c | mc_current_control.h | . | Start-up . | mc_start_up.c | mc_start_up.h | . | Phase currents . | mc_current_calculation.c | mc_current_calculation.h | . | DC bus voltage . | mc_voltage_measurement.c | mc_voltage_measurement.h | . | Rotor position . | mc_rotor_position.c | mc_rotor_position.h | . | . | Control library . | mc_generic_library.c | mc_generic_library.h | . | Data management . | mc_interface_handling.c | mc_interface_handling.h | . | User parameters . | mc_userparams.h | . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#modules-and-components",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html#modules-and-components"
  },"73": {
    "doc": "Implementation Details",
    "title": "Implementation Details",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/software_architecture.html"
  },"74": {
    "doc": "Software Design",
    "title": "Software Design",
    "content": "This section briefly describes the software design of the motor control firmware generated from the Motor Control Plant . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/software_design.html#software-design",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/software_design.html#software-design"
  },"75": {
    "doc": "Software Design",
    "title": "Software Design",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/software_design.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/software_design.html"
  },"76": {
    "doc": "Software Modules",
    "title": "Configure software modules",
    "content": "The MC Plant provides end users to configure the motor control software modules as per their project requirements. For convenience, the motor control software is divided into following modules: . | Start-up Configurator | Motor control and diagnosis | Output Stage and diagnosis | Current measurement and diagnosis | Voltage measurement and diagnosis | Rotor position calculation and diagnosis | . Each of the above-mentioned modules has their own set of configuration options. The following section describes the different configuration options for the software modules. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#configure-software-modules",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#configure-software-modules"
  },"77": {
    "doc": "Software Modules",
    "title": "Start-up Configurator",
    "content": "The sensorless position estimation techniques based on back-EMF require a minimum value of back EMF to estimate the electrical position of the rotor. The open-loop start-up procedure drives the PMSM till its speed reaches the minimum value where the back EMF values are large enough to estimate the rotor position. In the open-loop start-up procedure, the speed loop is de-activated. The currents are controlled directly in the dq reference frame by using assumed rotor position angles for transformations. The complete start-up procedure can be divided into following phases: . | Initial Field Alignment. In this phase, the PMSM rotor is locked to a specified rotor position by keeping a fixed rotor position angle. The d-axis or q-axis current is gradually ramped to the a specified value to avoid any over-current issues. | Open-loop Ramp. In this phase, the rotor position is constantly incremented based on user-defined ramp time to achieve the minimum required speed for the BEMF observer. The minimum ramp time and speed depend on PMSM drive electrical and mechanical parameters. This stage is the most critical step. Any mistuning of reference speed and acceleration can lead to start-up failure. | Stabilization. In this phase, the PMSM is allowed to rotate at a constant open-loop speed. This step ensures a smooth transition to close loop mode. | . Figure 1 shows a complete start-up procedure for a sensorless PMSM motor drive: . Figure.1 - Open-loop Start-up Procedure . In MC Plant the start-up configurator can be configured in following simple steps: . | Click on the “Start-up Configurator” block as shown below. Figure.2 - Open loop start-up module . | Configure the open loop start Figure.2 - Open-loop Start-up Configuration . | Configure flying start Figure.3 - Flying Start Configuration . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#start-up-configurator",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#start-up-configurator"
  },"78": {
    "doc": "Software Modules",
    "title": "Motor control and diagnosis",
    "content": "The Motor control and diagnosis module is responsible for the implementation of core motor control algorithm. It implements the motor control state machine, and the core control parameters. For details refer Software Architecture. In MC Plant the Motor control and diagnosis module can be configured in following simple steps: . | Click on the “Motor control and diagnosis” block as shown below. Figure.4 Motor Control and Diagnosis module . | Select the appropriate control type from dialog box Figure.5 - Motor Control and Diagnosis module configuration . | Click on the module blocks to configure the same. | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#motor-control-and-diagnosis",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#motor-control-and-diagnosis"
  },"79": {
    "doc": "Software Modules",
    "title": "Output Stage and diagnosis",
    "content": ". | Click on the “Output stage and diagnosis” block as shown below. Figure.6 - Output Stage and Diagnosis module . | Configure output stage parameters Figure.7 - Output Stage and Diagnosis module configuration . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#output-stage-and-diagnosis",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#output-stage-and-diagnosis"
  },"80": {
    "doc": "Software Modules",
    "title": "Current measurement and diagnosis",
    "content": "The Current measurement and diagnosis module is responsible for the implementation of motor current measurement technique required for the motor control application. For details refer Software Architecture. In MC Plant the Current measurement and diagnosis module can be configured in following simple steps: . | Click on the “Current measurement and diagnosis” block as shown below. Figure.8 - Current Measurement and Diagnosis module . | Configure current measurement parameters Figure.9 - Current Measurement and Diagnosis module configuration . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#current-measurement-and-diagnosis",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#current-measurement-and-diagnosis"
  },"81": {
    "doc": "Software Modules",
    "title": "Voltage measurement and diagnosis",
    "content": "The Voltage measurement and diagnosis module is responsible for the implementation of motor voltage measurement technique required for the motor control application. In MC Plant the Voltage measurement and diagnosis module can be configured in following simple steps: . | Click on the “Voltage measurement and diagnosis” block as shown below. Figure.10 - Voltage Measurement and Diagnosis module . | Configure voltage measurement parameters Figure.11 - Voltage Measurement and Diagnosis module configuration . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#voltage-measurement-and-diagnosis",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#voltage-measurement-and-diagnosis"
  },"82": {
    "doc": "Software Modules",
    "title": "Rotor position calculation and diagnosis",
    "content": "The Rotor position calculation and diagnosis module is responsible for the implementation of rotor position measurement technique required for the motor control application. For details refer Rotor Position Measurement . In MC Plant the Rotor position calculation and diagnosis module can be configured in following simple steps: . | Click on the “Rotor position calculation and diagnosis” block as shown below. Figure.12 - Rotor position calculation and diagnosis module . | Select the rotor position algorithm Figure.13 - Rotor position calculation and diagnosis module configuration . | Configure the rotor position algorithm | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#rotor-position-calculation-and-diagnosis",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html#rotor-position-calculation-and-diagnosis"
  },"83": {
    "doc": "Software Modules",
    "title": "Software Modules",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/mc_plant/software_modules.html"
  },"84": {
    "doc": "Theoretical Background",
    "title": "Theoretical Background",
    "content": "This section briefly describes some of the theoretical concepts related to PMSM control. ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/theoretical_background.html#theoretical-background",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/theoretical_background.html#theoretical-background"
  },"85": {
    "doc": "Theoretical Background",
    "title": "Theoretical Background",
    "content": " ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/mc_plant_docs/theory/theoretical_background.html",
    "relUrl": "/algorithms/pmsm_foc/mc_plant_docs/theory/theoretical_background.html"
  },"86": {
    "doc": "Using the Library",
    "title": "Using the Library",
    "content": ". | Instantiate PMSM_FOC component | Connect to required PLIBs (ADC, PWM, QDEC) and X2CScope and UART. Configure ADC, PWM and QDEC parameters in PMSM_FOC UI. Please refer to the project graph shown below. Note that PLIB names will be different for different devices | . | Select motor, control board, position feedback method in UI. Configure advanced parameters like field weakening, flying start. | Configure pins in the pin manager | Generate the code | PMSM_FOC is initialized in the SYS_Initialize() function. Function name is PMSM_FOC_Initialize(). | Call PMSM_FOC_Tasks() in the while loop in the main.c | Call X2CScope_Communicate() in the while loop in the main.c | Motor start/stop and direction change is done on the switch event. For MCLV2 board, press S2 to start/stop the motor. And press switch S3 to change the direction of the motor when motor is stopped. For MCHV3, press pushbutton to start/stop the motor | Vary the potentiometer to change the speed of the motor in speed loop . PMSM_FOC_Tasks(); X2CScope_Communicate(); . | . ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/using_the_library.html",
    "relUrl": "/algorithms/pmsm_foc/using_the_library.html"
  },"87": {
    "doc": "Software Design",
    "title": "Software Design",
    "content": "## Software Design ### SAMC21 and PIC32CM MC - PMSM FOC Control loop is implemented in the ADC result ready interrupt. Refer to the flow chart given below. - ADC channel conversion is triggered by the PWM overflow/zero match event. This trigger point could vary based on the current measurement techniques and MCU PWM IP implementation. - For bandwidth constraints, the FOC is executed every alternate PWM cycle - Slow loop task is executed in every 10ms in the task process. Polling of switches for user inputs is handled in the slow loop task. ### Timing Diagram ![timing_diagram](/motor_control/algorithms/pmsm_foc/images/timing_diagram_fixed_point.jpg) ### Flow Chart ![flow_chart](/motor_control/algorithms/pmsm_foc/images/flow_chart_fixed_point.jpg) ### State Machine - **Idle**: In this state, control waits for the switch press. - **Field Alignment**: Rotor is aligned to known position at D-axis or Q-axis by applying a pre-defined value of the current for a pre-defined length of time. The magnitude of the current and the length of the time for which it is applied depends upon the electrical and mechanical time constant of the PMSM motor drive. Electrical time constant of the motor is a function of R and L values of the motor windings, whereas the mechanical time constant of the motor drive is primarily a function of the static load on the motor shaft. - **Open Loop**: This state is applicable to sensorless position feedback methods. In this state, the speed of the PMSM motor is gradually ramped up using an open loop control. During this mode, the rotor angle is derived from the asserted open loop speed reference. This derived rotor angle would be lagging from the actual rotor angle. The speed is ramped up linearly to a minimum value required for the PLL estimator to estimate the electrical speed of the PMSM motor with sufficient accuracy. Rotor angle information is obtained by integrating the estimated electrical speed of the motor. - **Closed Loop**: Control switched to closed loop and rotor angle is obtained from the configured position feedback method. ### Code Structure ![code_structure](/motor_control/algorithms/pmsm_foc/images/code_structure_fixed_point.jpg) Configurations: - mc_userparameters.h contains the user configurations. PMSM FOC Application: - mc_pmsm_foc.c/h - PMSM FOC algorithm interface file Interrupts: - mc_function_coordinator.c - Initializes and coordinates motor control ISR and slow task processes - mc_error_handler.c - PWM fault ISR to take corrective action on over-current Control Middleware: - mc_motor_control.c/h - Implements the motor control state machines. Control library: - mc_start_up.c/h - Implements the initial field alignment and open loop start-up profile. - mc_speed_control.c/h - Calculate and regulates the reference speed - mc_current_control.c/h - Controls the direct and quadrature axis currents - mc_rotor_position.c/.h - Calculate the position and speed of the rotor - mc_voltage_measurement.c/h - Get the DC Bus voltage - mc_current_measurement.c/h - Get the motor phase currents - mc_interface_handling.c/h - Manages global variables and data-types - mc_generic_library.c/h - FOC library - mc_pwm.c/h - Space Vector modulation (SVM) and updating PWM duty cycles - mc_ramp_profiler.c/h - Speed reference profiles for user inputs HAL: - mc_hardware_abstraction.c/h - Hardware Abstraction Layer to interact with PLIBs ",
    "url": "http://localhost:4000/motor_control/algorithms/pmsm_foc/sw_design.html",
    "relUrl": "/algorithms/pmsm_foc/sw_design.html"
  },"88": {
    "doc": "Getting Started with Create React App",
    "title": "Getting Started with Create React App",
    "content": "# Getting Started with Create React App This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). ## Available Scripts In the project directory, you can run: ### `yarn start` Runs the app in the development mode.\\\\ Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.\\\\ You will also see any lint errors in the console. ### `yarn test` Launches the test runner in the interactive watch mode.\\\\ See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information. ### `yarn build` Builds the app for production to the `build` folder.\\\\ It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.\\\\ Your app is ready to be deployed! See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information. ### `yarn eject` **Note: this is a one-way operation. Once you `eject`, you can’t go back!** If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project. Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own. You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it. ## Learn More You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/). ",
    "url": "http://localhost:4000/motor_control/plugins/mc_plant/intro.html",
    "relUrl": "/plugins/mc_plant/intro.html"
  },"89": {
    "doc": "Microchip MPLAB® Harmony 3 Motor Control",
    "title": "Microchip MPLAB® Harmony 3 Motor Control",
    "content": "# Microchip MPLAB® Harmony 3 Motor Control MPLAB Harmony 3 is an extension of the MPLAB® ecosystem for creating embedded firmware solutions for Microchip 32-bit SAM and PIC32 microcontroller and microprocessor devices. Refer to the following links for more information. - [Microchip 32-bit MCUs for Motor Control Applications](https://www.microchip.com/design-centers/motor-control-and-drive/control-products/32-bit-solutions) - [Microchip 32-bit MCUs](https://www.microchip.com/design-centers/32-bit) - [Microchip 32-bit MPUs](https://www.microchip.com/design-centers/32-bit-mpus) - [Microchip MPLAB X IDE](https://www.microchip.com/mplab/mplab-x-ide) - [Microchip MPLAB Harmony](https://www.microchip.com/mplab/mplab-harmony) - [Microchip MPLAB Harmony Pages](https://microchip-mplab-harmony.github.io/) This repository contains the MPLAB® Harmony 3 Motor Control module. This module contains motor control demonstrations implemented on Microchip's 32-bit SAM and PIC32 microcontrollers. Users can use these demonstrations as a reference for developing their own motor control applications on Microchip's SAM and PIC32 series of microcontrollers using MPLAB Harmony 3. Refer to the following links for release notes and licensing information. - [Release Notes](/motor_control/release_notes.html) - [MPLAB Harmony License](/motor_control/mplab_harmony_license.html) # Contents Summary | Folder | Description |------------|-----------------------------------------------------------| algorithms | Motor Control Algorithm components | doc | Demonstration user guide in .chm format | docs | Demonstration user guide in HTML format | # Motor Control Algorithms | Algorithm | Description |------------ | -------------- | [PMSM FOC Algorithm](/motor_control/algorithms/pmsm_foc/readme.html) | To Control Permanent Magnet Synchronous Motors using Field Oriented Control (FOC) ||| # Motor Control Demo Applications Repositories | Repository Name | Description | Help Document | ----------------- | ------------------- | ---------------- | [mc_apps_pic32cm_mc](https://github.com/Microchip-MPLAB-Harmony/mc_apps_pic32cm_mc) | Motor Control Applications for PIC32CM MC family | [mc_apps_pic32cm_mc help](https://microchip-mplab-harmony.github.io/mc_apps_pic32cm_mc/) | [mc_apps_pic32mk](https://github.com/Microchip-MPLAB-Harmony/mc_apps_pic32mk) | Motor Control Applications for PIC32MK family | [mc_apps_pic32mk help](https://microchip-mplab-harmony.github.io/mc_apps_pic32mk/) | [mc_apps_sam_c2x](https://github.com/Microchip-MPLAB-Harmony/mc_apps_sam_c2x) | Motor Control Applications for SAM C2x family | [mc_apps_sam_c2x help](https://microchip-mplab-harmony.github.io/mc_apps_sam_c2x/) | [mc_apps_sam_d5x_e5x](https://github.com/Microchip-MPLAB-Harmony/mc_apps_sam_d5x_e5x) | Motor Control Applications for SAM E5x family | [mc_apps_sam_d5x_e5x help](https://microchip-mplab-harmony.github.io/mc_apps_sam_d5x_e5x/) | [mc_apps_sam_e7x_s7x_v7x](https://github.com/Microchip-MPLAB-Harmony/mc_apps_sam_e7x_s7x_v7x) | Motor Control Applications for SAM E7x family | [mc_apps_sam_e7x_s7x_v7x help](https://microchip-mplab-harmony.github.io/mc_apps_sam_e7x_s7x_v7x/) | [mc_apps_sam_rh71](https://github.com/Microchip-MPLAB-Harmony/mc_apps_sam_rh71) | Motor Control Applications for SAM RH71 family | [mc_apps_sam_rh71 help](https://microchip-mplab-harmony.github.io/mc_apps_sam_rh71/) ||||| ____ [![License](https://img.shields.io/badge/license-Harmony%20license-orange.svg)](https://github.com/Microchip-MPLAB-Harmony/mc/blob/master/mplab_harmony_license.md) [![Latest release](https://img.shields.io/github/release/Microchip-MPLAB-Harmony/mc.svg)](https://github.com/Microchip-MPLAB-Harmony/mc/releases/latest) [![Latest release date](https://img.shields.io/github/release-date/Microchip-MPLAB-Harmony/mc.svg)](https://github.com/Microchip-MPLAB-Harmony/mc/releases/latest) [![Commit activity](https://img.shields.io/github/commit-activity/y/Microchip-MPLAB-Harmony/mc.svg)](https://github.com/Microchip-MPLAB-Harmony/mc/graphs/commit-activity) [![Contributors](https://img.shields.io/github/contributors-anon/Microchip-MPLAB-Harmony/mc.svg)]() ____ [![Follow us on Youtube](https://img.shields.io/badge/Youtube-Follow%20us%20on%20Youtube-red.svg)](https://www.youtube.com/user/MicrochipTechnology) [![Follow us on LinkedIn](https://img.shields.io/badge/LinkedIn-Follow%20us%20on%20LinkedIn-blue.svg)](https://www.linkedin.com/company/microchip-technology) [![Follow us on Facebook](https://img.shields.io/badge/Facebook-Follow%20us%20on%20Facebook-blue.svg)](https://www.facebook.com/microchiptechnology/) [![Follow us on Twitter](https://img.shields.io/twitter/follow/MicrochipTech.svg?style=social)](https://twitter.com/MicrochipTech) [![](https://img.shields.io/github/stars/Microchip-MPLAB-Harmony/mc.svg?style=social)]() [![](https://img.shields.io/github/watchers/Microchip-MPLAB-Harmony/mc.svg?style=social)]() ",
    "url": "http://localhost:4000/motor_control/",
    "relUrl": "/"
  }
}
`;
var data_for_search

var repo_name = "motor_control";
var doc_folder_name = "docs";
var localhost_path = "http://localhost:4000/";
var home_index_string = "Microchip MPLAB® Harmony 3 Motor Control";

(function (jtd, undefined) {

// Event handling

jtd.addEvent = function(el, type, handler) {
  if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
}
jtd.removeEvent = function(el, type, handler) {
  if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
}
jtd.onReady = function(ready) {
  // in case the document is already rendered
  if (document.readyState!='loading') ready();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function(){
      if (document.readyState=='complete') ready();
  });
}

// Show/hide mobile menu

function initNav() {
  jtd.addEvent(document, 'click', function(e){
    var target = e.target;
    while (target && !(target.classList && target.classList.contains('nav-list-expander'))) {
      target = target.parentNode;
    }
    if (target) {
      e.preventDefault();
      target.parentNode.classList.toggle('active');
    }
  });

  const siteNav = document.getElementById('site-nav');
  const mainHeader = document.getElementById('main-header');
  const menuButton = document.getElementById('menu-button');

  jtd.addEvent(menuButton, 'click', function(e){
    e.preventDefault();

    if (menuButton.classList.toggle('nav-open')) {
      siteNav.classList.add('nav-open');
      mainHeader.classList.add('nav-open');
    } else {
      siteNav.classList.remove('nav-open');
      mainHeader.classList.remove('nav-open');
    }
  });
}
// Site search

function initSearch() {

    data_for_search = JSON.parse(myVariable);
    lunr.tokenizer.separator = /[\s/]+/

    var index = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 200 });
        this.field('content', { boost: 2 });
        this.field('url');
        this.metadataWhitelist = ['position']

        var location = document.location.pathname;
        var path = location.substring(0, location.lastIndexOf("/"));
        var directoryName = path.substring(path.lastIndexOf("/")+1);

        var cur_path_from_repo = path.substring(path.lastIndexOf(repo_name));

        // Decrement depth by 2 as HTML files are placed in repo_name/doc_folder_name
        var cur_depth_from_doc_folder = (cur_path_from_repo.split("/").length - 2);

        var rel_path_to_doc_folder = "";

        if (cur_depth_from_doc_folder == 0) {
            rel_path_to_doc_folder = "./"
        }
        else {
            for (var i = 0; i < cur_depth_from_doc_folder; i++)
            {
                rel_path_to_doc_folder = rel_path_to_doc_folder + "../"
            }
        }

        for (var i in data_for_search) {

            data_for_search[i].url = data_for_search[i].url.replace(localhost_path + repo_name, rel_path_to_doc_folder);

            if (data_for_search[i].title == home_index_string)
            {
                data_for_search[i].url = data_for_search[i].url + "index.html"
            }

            this.add({
                id: i,
                title: data_for_search[i].title,
                content: data_for_search[i].content,
                url: data_for_search[i].url
            });
        }
    });

    searchLoaded(index, data_for_search);
}function searchLoaded(index, docs) {
  var index = index;
  var docs = docs;
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var mainHeader = document.getElementById('main-header');
  var currentInput;
  var currentSearchIndex = 0;

  function showSearch() {
    document.documentElement.classList.add('search-active');
  }

  function hideSearch() {
    document.documentElement.classList.remove('search-active');
  }

  function update() {
    currentSearchIndex++;

    var input = searchInput.value;
    if (input === '') {
      hideSearch();
    } else {
      showSearch();
      // scroll search input into view, workaround for iOS Safari
      window.scroll(0, -1);
      setTimeout(function(){ window.scroll(0, 0); }, 0);
    }
    if (input === currentInput) {
      return;
    }
    currentInput = input;
    searchResults.innerHTML = '';
    if (input === '') {
      return;
    }

    var results = index.query(function (query) {
      var tokens = lunr.tokenizer(input)
      query.term(tokens, {
        boost: 10
      });
      query.term(tokens, {
        wildcard: lunr.Query.wildcard.TRAILING
      });
    });

    if ((results.length == 0) && (input.length > 2)) {
      var tokens = lunr.tokenizer(input).filter(function(token, i) {
        return token.str.length < 20;
      })
      if (tokens.length > 0) {
        results = index.query(function (query) {
          query.term(tokens, {
            editDistance: Math.round(Math.sqrt(input.length / 2 - 1))
          });
        });
      }
    }

    if (results.length == 0) {
      var noResultsDiv = document.createElement('div');
      noResultsDiv.classList.add('search-no-result');
      noResultsDiv.innerText = 'No results found';
      searchResults.appendChild(noResultsDiv);

    } else {
      var resultsList = document.createElement('ul');
      resultsList.classList.add('search-results-list');
      searchResults.appendChild(resultsList);

      addResults(resultsList, results, 0, 10, 100, currentSearchIndex);
    }

    function addResults(resultsList, results, start, batchSize, batchMillis, searchIndex) {
      if (searchIndex != currentSearchIndex) {
        return;
      }
      for (var i = start; i < (start + batchSize); i++) {
        if (i == results.length) {
          return;
        }
        addResult(resultsList, results[i]);
      }
      setTimeout(function() {
        addResults(resultsList, results, start + batchSize, batchSize, batchMillis, searchIndex);
      }, batchMillis);
    }

    function addResult(resultsList, result) {
      var doc = docs[result.ref];

      var resultsListItem = document.createElement('li');
      resultsListItem.classList.add('search-results-list-item');
      resultsList.appendChild(resultsListItem);

      var resultLink = document.createElement('a');
      resultLink.classList.add('search-result');
      resultLink.setAttribute('href', doc.url);
      resultsListItem.appendChild(resultLink);

      var resultTitle = document.createElement('div');
      resultTitle.classList.add('search-result-title');
      resultLink.appendChild(resultTitle);

      var resultDoc = document.createElement('div');
      resultDoc.classList.add('search-result-doc');
      resultDoc.innerHTML = '<svg viewBox="0 0 24 24" class="search-result-icon"><use xlink:href="#svg-doc"></use></svg>';
      resultTitle.appendChild(resultDoc);

      var resultDocTitle = document.createElement('div');
      resultDocTitle.classList.add('search-result-doc-title');
      resultDocTitle.innerHTML = doc.doc;
      resultDoc.appendChild(resultDocTitle);
      var resultDocOrSection = resultDocTitle;

      if (doc.doc != doc.title) {
        resultDoc.classList.add('search-result-doc-parent');
        var resultSection = document.createElement('div');
        resultSection.classList.add('search-result-section');
        resultSection.innerHTML = doc.title;
        resultTitle.appendChild(resultSection);
        resultDocOrSection = resultSection;
      }

      var metadata = result.matchData.metadata;
      var titlePositions = [];
      var contentPositions = [];
      for (var j in metadata) {
        var meta = metadata[j];
        if (meta.title) {
          var positions = meta.title.position;
          for (var k in positions) {
            titlePositions.push(positions[k]);
          }
        }
        if (meta.content) {
          var positions = meta.content.position;
          for (var k in positions) {
            var position = positions[k];
            var previewStart = position[0];
            var previewEnd = position[0] + position[1];
            var ellipsesBefore = true;
            var ellipsesAfter = true;
            for (var k = 0; k < 5; k++) {
              var nextSpace = doc.content.lastIndexOf(' ', previewStart - 2);
              var nextDot = doc.content.lastIndexOf('. ', previewStart - 2);
              if ((nextDot >= 0) && (nextDot > nextSpace)) {
                previewStart = nextDot + 1;
                ellipsesBefore = false;
                break;
              }
              if (nextSpace < 0) {
                previewStart = 0;
                ellipsesBefore = false;
                break;
              }
              previewStart = nextSpace + 1;
            }
            for (var k = 0; k < 10; k++) {
              var nextSpace = doc.content.indexOf(' ', previewEnd + 1);
              var nextDot = doc.content.indexOf('. ', previewEnd + 1);
              if ((nextDot >= 0) && (nextDot < nextSpace)) {
                previewEnd = nextDot;
                ellipsesAfter = false;
                break;
              }
              if (nextSpace < 0) {
                previewEnd = doc.content.length;
                ellipsesAfter = false;
                break;
              }
              previewEnd = nextSpace;
            }
            contentPositions.push({
              highlight: position,
              previewStart: previewStart, previewEnd: previewEnd,
              ellipsesBefore: ellipsesBefore, ellipsesAfter: ellipsesAfter
            });
          }
        }
      }

      if (titlePositions.length > 0) {
        titlePositions.sort(function(p1, p2){ return p1[0] - p2[0] });
        resultDocOrSection.innerHTML = '';
        addHighlightedText(resultDocOrSection, doc.title, 0, doc.title.length, titlePositions);
      }

      if (contentPositions.length > 0) {
        contentPositions.sort(function(p1, p2){ return p1.highlight[0] - p2.highlight[0] });
        var contentPosition = contentPositions[0];
        var previewPosition = {
          highlight: [contentPosition.highlight],
          previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
          ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
        };
        var previewPositions = [previewPosition];
        for (var j = 1; j < contentPositions.length; j++) {
          contentPosition = contentPositions[j];
          if (previewPosition.previewEnd < contentPosition.previewStart) {
            previewPosition = {
              highlight: [contentPosition.highlight],
              previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
              ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
            }
            previewPositions.push(previewPosition);
          } else {
            previewPosition.highlight.push(contentPosition.highlight);
            previewPosition.previewEnd = contentPosition.previewEnd;
            previewPosition.ellipsesAfter = contentPosition.ellipsesAfter;
          }
        }

        var resultPreviews = document.createElement('div');
        resultPreviews.classList.add('search-result-previews');
        resultLink.appendChild(resultPreviews);

        var content = doc.content;
        for (var j = 0; j < Math.min(previewPositions.length, 3); j++) {
          var position = previewPositions[j];

          var resultPreview = document.createElement('div');
          resultPreview.classList.add('search-result-preview');
          resultPreviews.appendChild(resultPreview);

          if (position.ellipsesBefore) {
            resultPreview.appendChild(document.createTextNode('... '));
          }
          addHighlightedText(resultPreview, content, position.previewStart, position.previewEnd, position.highlight);
          if (position.ellipsesAfter) {
            resultPreview.appendChild(document.createTextNode(' ...'));
          }
        }
      }
      var resultRelUrl = document.createElement('span');
      resultRelUrl.classList.add('search-result-rel-url');
      resultRelUrl.innerText = doc.relUrl;
      resultTitle.appendChild(resultRelUrl);
    }

    function addHighlightedText(parent, text, start, end, positions) {
      var index = start;
      for (var i in positions) {
        var position = positions[i];
        var span = document.createElement('span');
        span.innerHTML = text.substring(index, position[0]);
        parent.appendChild(span);
        index = position[0] + position[1];
        var highlight = document.createElement('span');
        highlight.classList.add('search-result-highlight');
        highlight.innerHTML = text.substring(position[0], index);
        parent.appendChild(highlight);
      }
      var span = document.createElement('span');
      span.innerHTML = text.substring(index, end);
      parent.appendChild(span);
    }
  }

  jtd.addEvent(searchInput, 'focus', function(){
    setTimeout(update, 0);
  });

  jtd.addEvent(searchInput, 'keyup', function(e){
    switch (e.keyCode) {
      case 27: // When esc key is pressed, hide the results and clear the field
        searchInput.value = '';
        break;
      case 38: // arrow up
      case 40: // arrow down
      case 13: // enter
        e.preventDefault();
        return;
    }
    update();
  });

  jtd.addEvent(searchInput, 'keydown', function(e){
    switch (e.keyCode) {
      case 38: // arrow up
        e.preventDefault();
        var active = document.querySelector('.search-result.active');
        if (active) {
          active.classList.remove('active');
          if (active.parentElement.previousSibling) {
            var previous = active.parentElement.previousSibling.querySelector('.search-result');
            previous.classList.add('active');
          }
        }
        return;
      case 40: // arrow down
        e.preventDefault();
        var active = document.querySelector('.search-result.active');
        if (active) {
          if (active.parentElement.nextSibling) {
            var next = active.parentElement.nextSibling.querySelector('.search-result');
            active.classList.remove('active');
            next.classList.add('active');
          }
        } else {
          var next = document.querySelector('.search-result');
          if (next) {
            next.classList.add('active');
          }
        }
        return;
      case 13: // enter
        e.preventDefault();
        var active = document.querySelector('.search-result.active');
        if (active) {
          active.click();
        } else {
          var first = document.querySelector('.search-result');
          if (first) {
            first.click();
          }
        }
        return;
    }
  });

  jtd.addEvent(document, 'click', function(e){
    if (e.target != searchInput) {
      hideSearch();
    }
  });
}

// Switch theme

jtd.getTheme = function() {
  var cssFileHref = document.querySelector('[rel="stylesheet"]').getAttribute('href');
  return cssFileHref.substring(cssFileHref.lastIndexOf('-') + 1, cssFileHref.length - 4);
}

jtd.setTheme = function(theme) {
  var cssFile = document.querySelector('[rel="stylesheet"]');
  cssFile.setAttribute('href', 'http://localhost:4000/motor_control/assets/css/just-the-docs-' + theme + '.css');
}

// Document ready

jtd.onReady(function(){
  initNav();
  initSearch();
});

})(window.jtd = window.jtd || {});


