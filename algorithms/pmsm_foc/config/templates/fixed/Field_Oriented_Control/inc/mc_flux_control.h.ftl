/**
 * @brief 
 *    Flux Control header file
 *
 * @File Name 
 *    mc_flux_control.h
 *
 * @Company 
 *   Microchip Technology Inc.
 *
 * @Summary
 *    This file contains declarations for flux control functions.
 *
 * @Description
 *    This file provides the function prototypes and data structures necessary for flux 
 *    control in motor control applications. Functions include initialization, enabling,
 *    disabling, and various control functions for manual and automatic flux control.
 */

//DOM-IGNORE-BEGIN
/*******************************************************************************
* Copyright (C) 2022 Microchip Technology Inc. and its subsidiaries.
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

#ifndef MCFLX_H
#define MCFLX_H

/*******************************************************************************
 * Header Inclusions
*******************************************************************************/
#include "mc_types.h"
#include "mc_pi_control.h"
#include "mc_userparams.h"
#include "mc_motor.h"

/*******************************************************************************
 * Default Module Configuration Parameters
*******************************************************************************/

/*******************************************************************************
 * Type Definitions
*******************************************************************************/
<#if MCPMSMFOC_ENABLE_MTPA == true >
/**
 * @brief Structure defining MTPA module state
 */
typedef struct
{
    bool enable;         /*!< Flag indicating if MTPA module is enabled */
    bool initDone;       /*!< Flag indicating if MTPA module initialization is done */

    int32_t K1;          /*!< K1 parameter */
    int32_t K2;          /*!< K2 parameter */
    int16_t mtpaIdRef;   /*!< Reference id current */
} tmcFlx_MTPA_s;
</#if>

<#if MCPMSMFOC_ENABLE_FW == true >
typedef struct {
    bool enable;
    bool initDone;
    int16_t RsValue;
    uint16_t RsShift;
    int16_t LdValue;
    uint16_t LdShift;
    int16_t KeValue;
    uint16_t KeShift;
    int16_t uqrefLimit;
    int16_t absIqRs;
    int16_t eMagnitude;
    int16_t omegaLdId;
    int16_t omegaLd;
    int16_t maxFluxWeakIdref;
    int16_t fluxWeakIdRef;
}tmcFlx_FluxWeakening_s;
</#if>

typedef struct
{
    float32_t Kp;                    /**< Proportional gain for PI controller */
    float32_t Ki;                    /**< Integral gain for PI controller */
    float32_t dt;                    /**< Sampling time */

<#if (MCPMSMFOC_ENABLE_MTPA == true) || (MCPMSMFOC_ENABLE_FW == true)>
    tmcMot_PMSM_s * pMotorParameters; /**< Pointer to motor parameters */
    float32_t maxNegativeCurrentInAmps;  /**< Maximum negative current  */
</#if>

<#if (MCPMSMFOC_ENABLE_FW == true)>
    float32_t fwTuneFactor;  /**< Field weakening tuning factor  */
</#if>

    void * pStatePointer;            /**< Pointer to the state structure */
} tmcFlx_Parameters_s;

/*******************************************************************************
 * Interface Variables
*******************************************************************************/

/*******************************************************************************
 * Static Interface Functions
*******************************************************************************/
/*! 
 * @brief Set module parameters
 *
 * This function sets the parameters for the flux control module.
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
__STATIC_INLINE void mcFlxI_ParametersSet(tmcFlx_Parameters_s * const pParameters)
{
    pParameters->Kp = (float32_t)${MCPMSMFOC_ID_PID_KP};
    pParameters->Ki = (float32_t)${MCPMSMFOC_ID_PID_KI};
    pParameters->dt = (float32_t)${MCPMSMFOC_PWM_PERIOD};

<#if MCPMSMFOC_ENABLE_MTPA == true>
    pParameters->pMotorParameters = &mcMotI_PMSM_gds;
</#if>

<#if MCPMSMFOC_ENABLE_FW == true>
    pParameters->pMotorParameters = &mcMotI_PMSM_gds;
    pParameters->maxNegativeCurrentInAmps = (float)(${MCPMSMFOC_FW_MAX_NEGATIVE_ID});
    pParameters->fwTuneFactor = (float)(1.30f);
</#if>
}

/*******************************************************************************
 * Interface Functions
*******************************************************************************/
/*! 
 * @brief Initialize flux control module
 *
 * Initializes the flux control module.
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlxI_FluxControlInit(tmcFlx_Parameters_s * const pParameters);

/*! 
 * @brief Enable flux control module
 *
 * Enables the flux control module.
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlxI_FluxControlEnable(tmcFlx_Parameters_s * const pParameters);

/*! 
 * @brief Disable flux control module
 *
 * Disables the flux control module.
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlxI_FluxControlDisable(tmcFlx_Parameters_s * const pParameters);

/*! 
 * @brief Manual flux control
 *
 * Performs manual flux control.
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @param[in] Out Output value for manual control
 * @return None
 */
#ifdef RAM_EXECUTE
void __ramfunc__ mcFlxI_FluxControlManual(const tmcFlx_Parameters_s * const pParameters, const int16_t Out);
#else
void mcFlxI_FluxControlManual(const tmcFlx_Parameters_s * const pParameters, const int16_t Out);
#endif

/*! 
 * @brief Automatic flux control
 *
 * Performs automatic flux control.
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @param[in] iDref Reference d-axis current
 * @param[in] iDact Actual d-axis current
 * @param[out] pOut Pointer to output variable for automatic control
 * @return None
 */
#ifdef RAM_EXECUTE
void __ramfunc__  mcFlxI_FluxControlAuto( const tmcFlx_Parameters_s * const pParameters,
                                        const int16_t iDref, const int16_t iDact, int16_t iDmax, int16_t * const pOut );
#else
void mcFlxI_FluxControlAuto( const tmcFlx_Parameters_s * const pParameters,
                                        const int16_t iDref, const int16_t iDact, int16_t iDmax, int16_t * const pOut );
#endif

/*! 
 * @brief Reset flux control
 *
 * Resets the flux control module.
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlxI_FluxControlReset(const tmcFlx_Parameters_s * const pParameters);

<#if (MCPMSMFOC_ENABLE_MTPA == true) || (MCPMSMFOC_ENABLE_FW == true)>
/*!
 * @brief Get reference flux
 *
 * Get reference flux
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
#ifdef RAM_EXECUTE
void __ramfunc__ mcFlxI_FluxReferenceGet(  const tmcFlx_Parameters_s * const pParameters,
                                        const tmcTypes_DQ_s * const pUDQ,
                                        tmcTypes_DQ_s * const pIDQ,
                                        tmcTypes_AlphaBeta_s * const pEAlphaBeta,
                                        const int16_t wmechRPM,
                                        const int16_t uBus,
                                        int16_t * const pIdref );
#else
void mcFlxI_FluxReferenceGet(  const tmcFlx_Parameters_s * const pParameters,
                                        const tmcTypes_DQ_s * const pUDQ,
                                        tmcTypes_DQ_s * const pIDQ,
                                        tmcTypes_AlphaBeta_s * const pEAlphaBeta,
                                        const int16_t wmechRPM,
                                        const int16_t uBus,
                                        int16_t * const pIdref );
#endif
</#if>

<#if MCPMSMFOC_ENABLE_MTPA == true>
/*!
 * @brief MTPA parameters initialization
 *
 *  MTPA parameters initialization
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_MTPAInit(tmcFlx_Parameters_s * const pParameters);

/*!
 * @brief Get MTPA current
 *
 * Get MTPA current
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @param[in] pUDQ Pointer to DQ axis voltage
 * @param[in] pIDQ Pointer to DQ axis current
 * @param[in] wmechRPM Mechanical speed of motor
 * @param[in] uBus Bus voltage
 * @return None
 */
#ifdef RAM_EXECUTE
int16_t __ramfunc__ mcFlx_MTPA(tmcFlx_MTPA_s * const pMTPA, tmcTypes_DQ_s * const pIDQ);
#else
int16_t mcFlx_MTPA(tmcFlx_MTPA_s * const pMTPA, tmcTypes_DQ_s * const pIDQ);
#endif

/*!
 * @brief MTPA reset
 *
 * Get MTPA current
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_MTPAReset(const tmcFlx_Parameters_s * const pParameters);

/*!
 * @brief MTPA parameters enable
 *
 *  MTPA parameters enable
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_MTPAEnable(tmcFlx_Parameters_s * const pParameters);

/*!
 * @brief MTPA parameters disable
 *
 *  MTPA parameters disable
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_MTPADisable(tmcFlx_Parameters_s * const pParameters);
</#if>

<#if MCPMSMFOC_ENABLE_FW == true>
/*!
 * @brief Field weakening parameters initialization
 *
 * Get field weakening current
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_FluxWeakeningInit(tmcFlx_Parameters_s * const pParameters);

/*!
 * @brief Get field weakening current
 *
 * Get field weakening current
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @param[in] pUDQ Pointer to DQ axis voltage
 * @param[in] pIDQ Pointer to DQ axis current
 * @param[in] wmechRPM Mechanical speed of motor
 * @param[in] uBus Bus voltage
 * @return None
 */
#ifdef RAM_EXECUTE
int16_t __ramfunc__ mcFlx_FluxWeakening(tmcFlx_FluxWeakening_s * const pFieldWeakening,
                                        const tmcTypes_DQ_s * const pUDQ,
                                        tmcTypes_DQ_s * const pIDQ,
                                        tmcTypes_AlphaBeta_s * const pEAlphaBeta,
                                        const int16_t wmechRPM,
                                        const int16_t uBus);
#else
int16_t mcFlx_FluxWeakening(tmcFlx_FluxWeakening_s * const pFieldWeakening,
                                        const tmcTypes_DQ_s * const pUDQ,
                                        tmcTypes_DQ_s * const pIDQ,
                                        tmcTypes_AlphaBeta_s * const pEAlphaBeta,
                                        const int16_t wmechRPM,
                                        const int16_t uBus);
#endif

/*!
 * @brief Field weakening reset
 *
 * Get field weakening current
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_FluxWeakeningReset(const tmcFlx_Parameters_s * const pParameters);

/*!
 * @brief Field weakening enable
 *
 *  Field weakening enable
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_FluxWeakeningEnable(tmcFlx_Parameters_s * const pParameters);

/*!
 * @brief Field weakening disable
 *
 *  Field weakening disable
 *
 * @param[in] pParameters Pointer to module parameters structure
 * @return None
 */
void mcFlx_FluxWeakeningDisable(tmcFlx_Parameters_s * const pParameters);
</#if>

#endif // MCFLX_H
