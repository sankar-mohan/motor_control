/**
 * @brief 
 *    Hardware abstraction header file
 *
 * @Company 
 *    Microchip Technology Inc.
 *
 * @File Name
 *   mc_hardware_abstraction.h
 *
 * @Summary
 *   Header file which shares global variables and function prototypes.
 *
 * @Description
 *   This file contains the global variables and function prototypes for hardware abstraction.
 */

//DOM-IGNORE-BEGIN
/*******************************************************************************
* Copyright (C) 2021 Microchip Technology Inc. and its subsidiaries.
*
* Subject to your compliance with these terms, you may use Microchip software
* and any derivatives exclusively with Microchip products. It is your
* responsibility to comply with third party license terms applicable to your
* use of third party software (including open source software) that may
* accompany Microchip software.
*
* THIS SOFTWARE IS SUPPLIED BY MICROCHIP "AS IS". NO WARRANTIES, WHETHER
* EXPRESS, IMPLIED OR STATUTORY, APPLY TO THIS SOFTWARE, INCLUDING ANY IMPLIED
* WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A
* PARTICULAR PURPOSE.
*
* IN NO EVENT WILL MICROCHIP BE LIABLE FOR ANY INDIRECT, SPECIAL, PUNITIVE,
* INCIDENTAL OR CONSEQUENTIAL LOSS, DAMAGE, COST OR EXPENSE OF ANY KIND
* WHATSOEVER RELATED TO THE SOFTWARE, HOWEVER CAUSED, EVEN IF MICROCHIP HAS
* BEEN ADVISED OF THE POSSIBILITY OR THE DAMAGES ARE FORESEEABLE. TO THE
* FULLEST EXTENT ALLOWED BY LAW, MICROCHIP'S TOTAL LIABILITY ON ALL CLAIMS IN
* ANY WAY RELATED TO THIS SOFTWARE WILL NOT EXCEED THE AMOUNT OF FEES, IF ANY,
* THAT YOU HAVE PAID DIRECTLY TO MICROCHIP FOR THIS SOFTWARE.
 *******************************************************************************/
//DOM-IGNORE-END

#ifndef MCHAL_H
#define MCHAL_H


/*******************************************************************************
  Header inclusions
*******************************************************************************/
#include "mc_types.h"
#include "definitions.h"

/*******************************************************************************
 * Interface variables
*******************************************************************************/
extern uint16_t mcHalI_IaAdcInput_gdu16; /**< Phase A current ADC input */
extern uint16_t mcHalI_IbAdcInput_gdu16; /**< Phase B current ADC input */
extern uint16_t mcHalI_UbusAdcInput_gdu16; /**< DC bus voltage ADC input */
extern uint16_t mcHalI_Potentiometer_gdu16; /**< Potentiometer ADC input */
extern int16_t mcPwmI_Duty_gau16[3u];  /**< PWM duty cycle array */

/*******************************************************************************
 * User defined data structure
*******************************************************************************/

<#function extractNumericValue alphanumericString>
  <#assign numericString = "">
  <#list 0..(alphanumericString?length-1) as i>
    <#if alphanumericString[i]?matches("[0-9]")>
      <#assign numericString += alphanumericString[i]>
    </#if>
  </#list>
  <#if numericString?length == 0>
    <#return 0>
  <#else>
    <#return numericString?number>
  </#if>
</#function>


/*******************************************************************************
 * Static interface Functions
*******************************************************************************/

/**
 * @brief Get PWM period.
 *
 * @details
 * Get PWM period.
 *
 * @return PWM period.
 */
__STATIC_INLINE uint16_t mcHalI_PwmPeriodGet( void )
{
<#if "TCC_U2213" == MCPMSMFOC_PWM_IP>
    return (uint16_t)${MCPMSMFOC_PWM_INSTANCE}_PWM24bitPeriodGet();
<#elseif "PWM_6343" == MCPMSMFOC_PWM_IP>
    return (uint16_t)${MCPMSMFOC_PWM_INSTANCE}_ChannelPeriodGet(PWM_CHANNEL_${MCPMSMFOC_PWM_A_CHANNEL});
<#elseif "MCPWM_01477" == MCPMSMFOC_PWM_IP>
    return (uint16_t)${MCPMSMFOC_PWM_INSTANCE}_PrimaryPeriodGet();
</#if>
}

/**
 * @brief Set the PWM inverter duty cycle.
 *
 * @details
 * Sets the PWM inverter duty.
 *
 * @param[in] dutyCycle Pointer to the duty cycle array.
 */
__STATIC_FORCEINLINE void mcHalI_InverterPwmSet( const int16_t * const dutyCycle )
{
<#if "TCC_U2213" == MCPMSMFOC_PWM_IP>
<#if MCPMSMFOC_FOC_X2C_ENABLE == true>
    uint8_t status;

    status = (uint8_t)${MCPMSMFOC_PWM_INSTANCE}_PWM24bitDutySet(${MCPMSMFOC_PWM_INSTANCE}_CHANNEL${MCPMSMFOC_PWM_A_CHANNEL}, dutyCycle[0u] );
    status &= (uint8_t)${MCPMSMFOC_PWM_INSTANCE}_PWM24bitDutySet(${MCPMSMFOC_PWM_INSTANCE}_CHANNEL${MCPMSMFOC_PWM_B_CHANNEL}, dutyCycle[1u] );
    status &= (uint8_t)${MCPMSMFOC_PWM_INSTANCE}_PWM24bitDutySet(${MCPMSMFOC_PWM_INSTANCE}_CHANNEL${MCPMSMFOC_PWM_C_CHANNEL}, dutyCycle[2u] );

    if( 0u == status )
    {
      /** ToDO: Log error */
    }
<#else>
    uint8_t status;
    uint16_t period;
    uint16_t duty[3u] = {0u};

    period = (uint16_t)mcHalI_PwmPeriodGet();
    duty[0u] = period - (uint16_t)dutyCycle[0u];
    duty[1u] = period - (uint16_t)dutyCycle[1u];
    duty[2u] = period - (uint16_t)dutyCycle[2u];

    status = (uint8_t)${MCPMSMFOC_PWM_INSTANCE}_PWM24bitDutySet(${MCPMSMFOC_PWM_INSTANCE}_CHANNEL${MCPMSMFOC_PWM_A_CHANNEL}, duty[0u] );
    status &= (uint8_t)${MCPMSMFOC_PWM_INSTANCE}_PWM24bitDutySet(${MCPMSMFOC_PWM_INSTANCE}_CHANNEL${MCPMSMFOC_PWM_B_CHANNEL}, duty[1u] );
    status &= (uint8_t)${MCPMSMFOC_PWM_INSTANCE}_PWM24bitDutySet(${MCPMSMFOC_PWM_INSTANCE}_CHANNEL${MCPMSMFOC_PWM_C_CHANNEL}, duty[2u] );

    if( 0u == status )
    {
      /** ToDO: Log error */
    }
</#if>
<#elseif "PWM_6343" == MCPMSMFOC_PWM_IP>
    uint16_t period;
    uint16_t duty[3u] = {0u};

    period = (uint16_t)mcHalI_PwmPeriodGet();
    duty[0u] = period - (uint16_t)dutyCycle[0u];
    duty[1u] = period - (uint16_t)dutyCycle[1u];
    duty[2u] = period - (uint16_t)dutyCycle[2u];

    ${MCPMSMFOC_PWM_INSTANCE}_ChannelDutySet(PWM_CHANNEL_${MCPMSMFOC_PWM_A_CHANNEL}, duty[0u] );
    ${MCPMSMFOC_PWM_INSTANCE}_ChannelDutySet(PWM_CHANNEL_${MCPMSMFOC_PWM_B_CHANNEL}, duty[1u] );
    ${MCPMSMFOC_PWM_INSTANCE}_ChannelDutySet(PWM_CHANNEL_${MCPMSMFOC_PWM_C_CHANNEL}, duty[2u] );

<#elseif "MCPWM_01477" == MCPMSMFOC_PWM_IP>
    ${MCPMSMFOC_PWM_INSTANCE}_ChannelPrimaryDutySet(${MCPMSMFOC_PWM_INSTANCE}_CH_${MCPMSMFOC_PWM_A_CHANNEL}, (uint16_t)dutyCycle[0] );
    ${MCPMSMFOC_PWM_INSTANCE}_ChannelPrimaryDutySet(${MCPMSMFOC_PWM_INSTANCE}_CH_${MCPMSMFOC_PWM_B_CHANNEL}, (uint16_t)dutyCycle[1] );
    ${MCPMSMFOC_PWM_INSTANCE}_ChannelPrimaryDutySet(${MCPMSMFOC_PWM_INSTANCE}_CH_${MCPMSMFOC_PWM_C_CHANNEL}, (uint16_t)dutyCycle[2] );
</#if>
}

/**
 * @brief Get Phase A current from ADC peripheral.
 *
 * @details
 * Get analog signals from ADC peripheral.

 * @param[out] Global variable 'mcHalI_IaAdcInput_gdu16'
 */
__STATIC_FORCEINLINE void mcHalI_PhaseACurrentGet( void )
{
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
    mcHalI_IaAdcInput_gdu16 = ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_ConversionResultGet();
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
    mcHalI_IaAdcInput_gdu16 = ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_ChannelResultGet(AFEC_CH${MCPMSMFOC_PHASE_CURRENT_IA_CHANNEL});
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
  <#if MCPMSMFOC_PHASE_CURRENT_IA_UNIT != "ADC7">
    <#assign numericValue = extractNumericValue(MCPMSMFOC_PHASE_CURRENT_IA_UNIT)>
    mcHalI_IaAdcInput_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${numericValue});
  <#else>
    mcHalI_IaAdcInput_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${MCPMSMFOC_PHASE_CURRENT_IA_CHANNEL});
  </#if>
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
    mcHalI_IaAdcInput_gdu16 = ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_ChannelResultGet(ADC_CH${MCPMSMFOC_PHASE_CURRENT_IA_CHANNEL});
</#if>
}

/**
 * @brief Get Phase B current from ADC peripheral.
 *
 * @details
 * Get Phase B current from ADC peripheral.

 * @param[out] Global variable 'mcHalI_IbAdcInput_gdu16'
 */
__STATIC_FORCEINLINE void mcHalI_PhaseBCurrentGet( void )
{
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
    mcHalI_IbAdcInput_gdu16 =  ${MCPMSMFOC_PHASE_CURRENT_IB_UNIT}_ConversionResultGet();
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
    mcHalI_IbAdcInput_gdu16 =  ${MCPMSMFOC_PHASE_CURRENT_IB_UNIT}_ChannelResultGet(AFEC_CH${MCPMSMFOC_PHASE_CURRENT_IB_CHANNEL});
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
  <#if MCPMSMFOC_PHASE_CURRENT_IB_UNIT != "ADC7">
    <#assign numericValue = extractNumericValue(MCPMSMFOC_PHASE_CURRENT_IB_UNIT)>
    mcHalI_IbAdcInput_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${numericValue});
  <#else>
    mcHalI_IbAdcInput_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${MCPMSMFOC_PHASE_CURRENT_IB_CHANNEL});
  </#if>
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
    mcHalI_IbAdcInput_gdu16 =  ${MCPMSMFOC_PHASE_CURRENT_IB_UNIT}_ChannelResultGet(ADC_CH${MCPMSMFOC_PHASE_CURRENT_IB_CHANNEL});
</#if>
}

/**
 * @brief Get DC link voltage from ADC peripheral.
 *
 * @details
 * Get DC link voltage from ADC peripheral.

 * @param[out] Global variable 'mcHalI_UbusAdcInput_gdu16'
 */
__STATIC_FORCEINLINE void mcHalI_DcLinkVoltageGet( void )
{
    /** Get ADC value for DC bus voltage */
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
    mcHalI_UbusAdcInput_gdu16 = ${MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT}_ConversionResultGet();
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
    mcHalI_UbusAdcInput_gdu16 = ${MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT}_ChannelResultGet(AFEC_CH${MCPMSMFOC_BUS_VOLTAGE_VDC_CHANNEL});
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
  <#if MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT != "ADC7">
    <#assign numericValue = extractNumericValue(MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT)>
    mcHalI_UbusAdcInput_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${numericValue});
  <#else>
    mcHalI_UbusAdcInput_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${MCPMSMFOC_BUS_VOLTAGE_VDC_CHANNEL});
  </#if>
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
    mcHalI_UbusAdcInput_gdu16 = ${MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT}_ChannelResultGet(ADC_CH${MCPMSMFOC_BUS_VOLTAGE_VDC_CHANNEL});
</#if>
}

/**
 * @brief Get potentiometer input from ADC peripheral.
 *
 * @details
 * Get potentiometer input from ADC peripheral.

 * @param[out] Global variable 'mcHalI_Potentiometer_gdu16'
 */
__STATIC_FORCEINLINE void mcHalI_PotentiometerInputGet( void )
{
    /** Get ADC value for DC bus voltage */
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
    mcHalI_Potentiometer_gdu16 = ${MCPMSMFOC_POTENTIOMETER_VPOT_UNIT}_ConversionResultGet();
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
    mcHalI_Potentiometer_gdu16 = ${MCPMSMFOC_POTENTIOMETER_VPOT_UNIT}_ChannelResultGet(AFEC_CH${MCPMSMFOC_POTENTIOMETER_VPOT_CHANNEL});
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
  <#if MCPMSMFOC_POTENTIOMETER_VPOT_UNIT != "ADC7">
    <#assign numericValue = extractNumericValue(MCPMSMFOC_POTENTIOMETER_VPOT_UNIT)>
    mcHalI_Potentiometer_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${numericValue});
  <#else>
    mcHalI_Potentiometer_gdu16 = ADCHS_ChannelResultGet(ADCHS_CH${MCPMSMFOC_POTENTIOMETER_VPOT_CHANNEL});
  </#if>
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
    mcHalI_Potentiometer_gdu16 = ${MCPMSMFOC_POTENTIOMETER_VPOT_UNIT}_ChannelResultGet(ADC_CH${MCPMSMFOC_POTENTIOMETER_VPOT_CHANNEL});
</#if>
}

<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
/**
 * @brief Select phase A current channel for next conversion
 *
 * @details
 * Select phase A current channel for next conversion
 */
__STATIC_FORCEINLINE void mcHalI_PhaseACurrentChannelSelect( void  )
{
    ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_ChannelSelect( ADC_POSINPUT_AIN${MCPMSMFOC_PHASE_CURRENT_IA_CHANNEL}, ADC_NEGINPUT_GND);
}

/**
 * @brief Select phase B current channel for next conversion
 *
 * @details
 * Select phase B current channel for next conversion
 */
__STATIC_FORCEINLINE void mcHalI_PhaseBCurrentChannelSelect( void  )
{
    ${MCPMSMFOC_PHASE_CURRENT_IB_UNIT}_ChannelSelect( ADC_POSINPUT_AIN${MCPMSMFOC_PHASE_CURRENT_IB_CHANNEL}, ADC_NEGINPUT_GND);
}

/**
 * @brief Select potentiometer channel for conversion
 *
 * @details
 * Select potentiometer channel for conversion
 */
__STATIC_FORCEINLINE void mcHalI_PotentiometerChannelSelect( void )
{
    ${MCPMSMFOC_POTENTIOMETER_VPOT_UNIT}_ChannelSelect( ADC_POSINPUT_AIN${MCPMSMFOC_POTENTIOMETER_VPOT_CHANNEL}, ADC_NEGINPUT_GND);
}

/**
 * @brief Select DC link voltage channel for conversion
 *
 * @details
 * Select DC link voltage channel for conversion
 */
__STATIC_FORCEINLINE void mcHalI_DcLinkVoltageChannelSelect( void  )
{
    ${MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT}_ChannelSelect( ADC_POSINPUT_AIN${MCPMSMFOC_BUS_VOLTAGE_VDC_CHANNEL}, ADC_NEGINPUT_GND);
}

/**
 * @brief Start ADC conversion
 *
 * @details
 * Start ADC conversion
 */
__STATIC_FORCEINLINE void mcHalI_AdcSoftwareConversionStart( void )
{
    /* Enable software  trigger */
    ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_InterruptsClear(ADC_STATUS_MASK);
    ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_InterruptsDisable( ADC_STATUS_RESRDY );
    ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_ConversionStart();
}

/**
 * @brief Re-enable ADC conversion from PWM event source
 *
 * @details
 * Re-enable ADC conversion from PWM event source
 */
__STATIC_FORCEINLINE void mcHalI_AdcHardwareTriggerRenable( void )
{
    /* Re-enable hardware trigger */
    ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_InterruptsClear(ADC_STATUS_MASK);
    ${MCPMSMFOC_PHASE_CURRENT_IA_UNIT}_InterruptsEnable( ADC_STATUS_RESRDY );
}
</#if>

/**
 * @brief Clear ADC interrupt flag
 *
 * @details
 * Clear ADC interrupt flag
 */
__STATIC_FORCEINLINE void mcHalI_AdcInterruptClear( void )
{
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
    ADC0_InterruptsClear(ADC_STATUS_MASK);
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
    NVIC_ClearPendingIRQ(AFEC0_IRQn);
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
<#if MCPMSMFOC_PHASE_CURRENT_IA_UNIT != "ADC7">
    <#assign numericValue = extractNumericValue(MCPMSMFOC_PHASE_CURRENT_IA_UNIT)>
    EVIC_SourceStatusClear(INT_SOURCE_ADC_DATA${numericValue });
<#else>
    EVIC_SourceStatusClear(INT_SOURCE_ADC_DATA${MCPMSMFOC_PHASE_CURRENT_IA_CHANNEL});
</#if>
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
    NVIC_ClearPendingIRQ(ADC_IRQn);
</#if>
}

/**
 * @brief ADC interrupt disable
 *
 * @details
 * ADC interrupt disable
 */
__STATIC_FORCEINLINE void mcHalI_AdcInterruptDisable( void )
{
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
    ADC0_InterruptsDisable( ADC_STATUS_RESRDY );
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
    NVIC_DisableIRQ(AFEC0_IRQn);
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
<#if MCPMSMFOC_PHASE_CURRENT_IA_UNIT != "ADC7">
    <#assign numericValue = extractNumericValue(MCPMSMFOC_PHASE_CURRENT_IA_UNIT)>
    EVIC_SourceDisable(INT_SOURCE_ADC_DATA${numericValue});
<#else>
    EVIC_SourceDisable(INT_SOURCE_ADC_DATA${MCPMSMFOC_PHASE_CURRENT_IA_CHANNEL});
</#if>
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
    NVIC_DisableIRQ(ADC_IRQn);
</#if>
}

/**
 * @brief ADC interrupt enable
 *
 * @details
 * ADC interrupt enable
 */
__STATIC_FORCEINLINE void mcHalI_AdcInterruptEnable( void )
{
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
    ADC0_InterruptsEnable( ADC_STATUS_RESRDY );
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
    NVIC_EnableIRQ(AFEC0_IRQn);
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
    NVIC_EnableIRQ(ADC_IRQn);
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
<#if MCPMSMFOC_PHASE_CURRENT_IA_UNIT != "ADC7">
    <#assign numericValue = extractNumericValue(MCPMSMFOC_PHASE_CURRENT_IA_UNIT)>
    EVIC_SourceEnable(INT_SOURCE_ADC_DATA${numericValue});
<#else>
    EVIC_SourceEnable(INT_SOURCE_ADC_DATA${MCPMSMFOC_PHASE_CURRENT_IA_CHANNEL});
</#if>
</#if>
}

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORED_ENCODER'>
/**
 * @brief Get quadrature decoder position counts
 *
 * @details
 * Get quadrature decoder position counts
 *
 * @return  Quadrature decoder position counts
 */
__STATIC_FORCEINLINE uint16_t mcHalI_EncoderPositionGet( void  )
{
<#if "PDEC_U2263" == MCPMSMFOC_QEI_IP>
    return (uint16_t)${MCPMSMFOC_ENCODER_PERIPHERAL}_QDECPositionGet();
<#elseif "TC_6082" == MCPMSMFOC_QEI_IP>
    return (uint16_t)${MCPMSMFOC_ENCODER_PERIPHERAL}_QuadraturePositionGet();
<#elseif "QEI_01494" == MCPMSMFOC_QEI_IP>
    return (uint16_t)${MCPMSMFOC_ENCODER_PERIPHERAL}_PositionGet();
</#if>
}

<#if "QEI_01494" == MCPMSMFOC_QEI_IP>
/**
 * @brief Get quadrature decoder velocity counts
 *
 * @details
 * Get quadrature decoder velocity counts
 *
 * @return  Quadrature decoder velocity counts
 */
__STATIC_FORCEINLINE int16_t mcHalI_EncoderVelocityGet( void  )
{
    return (int16_t)${MCPMSMFOC_ENCODER_PERIPHERAL}_VelocityGet();
}
</#if>
</#if>

/*******************************************************************************
 * Interface Functions
*******************************************************************************/
/**
 * @brief Enable three phase inverter
 *
 * @details
 * Enable three phase inverter
 */
void mcHalI_InverterPwmEnable( void );

/**
 * @brief Disable three phase inverter
 *
 * @details
 * Disable three phase inverter
 */
void mcHalI_InverterPwmDisable( void );

<#--  Get led function  -->
<#function ledFunction index>
<#if 0 == index>
<#return MCPMSMFOC_LED_0_FUNCTION>
<#elseif 1 == index>
<#return MCPMSMFOC_LED_1_FUNCTION>
<#else>
<#return "Error">
</#if>
</#function>

<#if MCPMSMFOC_LEDS_AVAILABLE != 0 >
<#list 0..10 as index>
<#if "Direction Indication" == ledFunction(index)>
/**
 * @brief Set direction indication
 *
 * @details
 * Set direction indication
 */
void mcHal_DirectionIndication( void );
</#if>
</#list>
</#if>

<#if MCPMSMFOC_LEDS_AVAILABLE != 0 >
<#list 0..10 as index>
<#if "Fault Indication" == ledFunction(index)>
/**
 * @brief Fault indication led state set
 *
 * @details
 * Fault indication led state set
 */
void mcHal_FaultIndicationSet( void );
</#if>
</#list>
</#if>

/**
 * @brief Enable ADC peripheral
 *
 * @details
 * Enable ADC peripheral
 */
void mcHalI_AdcEnable( void );

/**
 * @brief Start PWM timer
 *
 * @details
 * Start PWM timer
 */
void mcHalI_PwmTimerStart( void );

/**
 * @brief ADC conversion complete interrupt callback function
 *
 * @details
 * ADC conversion complete interrupt callback function
 */
<#if "ADC_U2500" == MCPMSMFOC_ADC_IP>
void mcHalI_AdcCallBackRegister( ADC_CALLBACK callback, uintptr_t context );
<#elseif "AFEC_11147" == MCPMSMFOC_ADC_IP>
void mcHalI_AdcCallBackRegister( AFEC_CALLBACK callback, uintptr_t context );
<#elseif "ADC_44073" == MCPMSMFOC_ADC_IP>
void mcHalI_AdcCallBackRegister( ADC_CALLBACK callback, uintptr_t context );
<#elseif "ADCHS_02508" == MCPMSMFOC_ADC_IP>
void mcHalI_AdcCallBackRegister( ADCHS_CALLBACK callback, uintptr_t context );
</#if>

/**
 * @brief PWM fault interrupt callback function
 *
 * @details
 * PWM fault interrupt callback function
 */
<#if "TCC_U2213" == MCPMSMFOC_PWM_IP>
void mcHalI_PwmCallbackRegister( TCC_CALLBACK callback, uintptr_t context );
<#elseif "PWM_6343" == MCPMSMFOC_PWM_IP>
void mcHalI_PwmCallbackRegister( PWM_CALLBACK callback, uintptr_t context );
<#elseif "MCPWM_01477" == MCPMSMFOC_PWM_IP>
void mcHalI_PwmCallbackRegister( MCPWM_CH_CALLBACK callback, uintptr_t context );
</#if>

/**
 * @brief Enable PWM fault interrupt
 *
 * @details
 * Enable PWM fault interrupt
 */
void mcHalI_PwmInterruptEnable( void );

<#--  Get button function  -->
<#function buttonFunction index>
<#if 0 == index>
<#return MCPMSMFOC_BUTTON_0_FUNCTION>
<#elseif 1 == index>
<#return MCPMSMFOC_BUTTON_1_FUNCTION>
<#else>
<#return "Error">
</#if>
</#function>

<#if MCPMSMFOC_BUTTONS_AVAILABLE != 0 >
<#list 0..( MCPMSMFOC_BUTTONS_AVAILABLE - 1 ) as index>

<#if "Start/Stop" == buttonFunction(index)>
/**
 * @brief Get start-stop button state
 *
 * @details
 * Get start-stop button state
 *
 * @return  True if button is pressed, false if button is not pressed
 */
bool mcHalI_StartStopButtonState( void );
<#break>
</#if>
</#list>
</#if>


<#if MCPMSMFOC_BUTTONS_AVAILABLE != 0 >
<#list 0..( MCPMSMFOC_BUTTONS_AVAILABLE - 1 ) as index>
<#if "Direction Toggle" == buttonFunction(index)>
/**
 * @brief Get direction button state
 *
 * @details
 * Get direction button state
 *
 * @return  True if button is pressed, false if button is not pressed
 */
bool mcHalI_DirectionButtonState( void );
<#break>
</#if>
</#list>
</#if>

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORED_ENCODER'>
/**
 * @brief Start encoder pulses counter of qudarature decoder
 *
 * @details
 * Start encoder pulses counter of qudarature decoder
 */
void mcHalI_EncoderStart( void  );

/**
 * @brief Stop encoder pulses counter of qudarature decoder
 *
 * @details
 * Stop encoder pulses counter of qudarature decoder
 */
void mcHalI_EncoderStop( void  );

</#if>

#endif // MCHAL_H
