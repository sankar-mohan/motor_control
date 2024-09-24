/**
 * @file mc_rotor_position_estimation.c
 *
 * @brief 
 *    Source file for rotor position estimation
 *
 * @File Name 
 *    mc_rotor_position_estimation.c
 *
 * @Company 
 *    Microchip Technology Inc.
 *
 * @Summary
 *    Source file which contains variables and function implementations for rotor position estimation.
 *
 * @Description
 *    This file contains variables and function implementations which are generally used for rotor
 *    position estimation in pulse width modulation. 
 */

// DOM-IGNORE-BEGIN
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
// DOM-IGNORE-END

/*******************************************************************************
Headers inclusions
*******************************************************************************/
#include "mc_rotor_position_estimation.h"

/*******************************************************************************
Constants
*******************************************************************************/
#define ENABLE_PHI_OFFSET_COMPENSATION
#define SQUARE_ROOT_THREE_OVER_TWO     (float32_t)1.224744871

/*******************************************************************************
Local configuration options
*******************************************************************************/

/*******************************************************************************
 Private data types
*******************************************************************************/
typedef struct
{
   /** States */
   bool enable;
   bool initDone;
   float32_t  eAlpha;
   float32_t  eBeta;
   float32_t  eD;
   float32_t  eQ;
   float32_t  uAlpha;
   float32_t  uBeta;
   float32_t  iAlpha;
   float32_t  iBeta;
   float32_t  n;
   float32_t  phi;

   /** Parameters */
   float32_t   dt;
   float32_t   Rs;
   float32_t   dLsByDt;
   float32_t   eABFilterParameter;
   float32_t   eDQFilterParameter;
   float32_t   nFilterParameter;
   float32_t   oneByKe;
   float32_t   speedToAngle;

   float32_t phiOffset;
   uint16_t calibCounter;
   uint16_t calibTimeinCounts;
}tmcRpe_State_s;

/*******************************************************************************
Private variables
*******************************************************************************/
static tmcRpe_State_s mcRpe_State_mds;

/*******************************************************************************
Interface  variables
*******************************************************************************/

/*******************************************************************************
Macro Functions
*******************************************************************************/
/**
 * Low pass filter: y = y + a* ( x - y )
 */
#define LPF(x,y ,a)  (y) = (y) + (a) * ( (x) - (y))

/*******************************************************************************
Private Functions
*******************************************************************************/

/*******************************************************************************
 * Interface Functions
*******************************************************************************/
/*! 
 * @brief Initialize rotor position estimation module
 *
 * @details
 * Initialize rotor position estimation module
 *
 * @param[in] pParameters - Pointer to parameters structure
 *
 * @return None
 */
void  mcRpeI_RotorPositionEstimInit( tmcRpe_Parameters_s * const pParameters )
{
    /** Link state variable structure to the module */
    pParameters->pStatePointer = (void *)&mcRpe_State_mds;
    tmcRpe_State_s * pState = &mcRpe_State_mds;

    /** Set parameters */
    mcRpeI_ParametersSet(pParameters);

    /** Set state parameters  */
    pState->Rs =  pParameters->pMotorParameters->RsInOhms;
    pState->dt = pParameters->dt;
    pState->dLsByDt = pParameters->pMotorParameters->LdInHenry / pState->dt;

    /**
         *  Calculate filter parameters:
         *  Assumption: The frequency of alpha and beta axis is restrained by the maximum
         *  speed of the motor
         *      Nmax (in Hertz ) = Zp * Nrpm / 60
         *
         *  Considering cut-off frequency as twice the value of Nmax
         *      Fo ( in Hertz ) = 2 * Nmax
         *
         *      Tau = 1/( 2* Pi * Fo )
         *
         *  For a discrete first order forward euler filter, the filter parameter can be
         *  calculated as follows:
         *
         *      a = ts/( ts + Tau ), where ts is the sampling time
         */
    float32_t temp;
    temp = pParameters->pMotorParameters->PolePairs;
    temp = temp * pParameters->pMotorParameters->NmaxInRpm;
    temp = 2.0f * temp/ 60.0f;
    temp = 1.0f/( TWO_PI * temp );
    pState->eABFilterParameter = pState->dt/(pState->dt + temp );

    /** ToDO: Remove magic numbers */
    pState->oneByKe = ( SQUARE_ROOT_THREE_OVER_TWO * 1000.0f )/ ( pParameters->Ke );
    pState->speedToAngle = TWO_PI * pParameters->pMotorParameters->PolePairs * pState->dt/ 60.0f;

    pState->eDQFilterParameter = 1.0f;
    pState->nFilterParameter = 1.0f;

    /** Rotor position calibration time */
    pState->calibTimeinCounts = pParameters->calibTimeInSec / pParameters->dt;

    /** Set initialization flag to true */
    pState->initDone = true;
}

/*! 
 * @brief Enable rotor position estimation module
 *
 * @details
 * Enable rotor position estimation module
 *
 * @param[in] pParameters - Pointer to parameters structure
 *
 * @return None
 */
void  mcRpeI_RotorPositionEstimEnable( tmcRpe_Parameters_s * const pParameters )
{
    /** Get the linked state variable */
    tmcRpe_State_s * pState;
    pState = (tmcRpe_State_s *)pParameters->pStatePointer;

    if( ( NULL == pState ) || ( !pState->initDone ))
    {
         /** Initialize parameters */
        mcRpeI_RotorPositionEstimInit(pParameters);
    }
    else
    {
         /** For MISRA Compliance */
    }

    /** Set enable flag as true */
    pState->enable = true;
}

/*! 
 * @brief Disable rotor position estimation module
 *
 * @details
 * Disable rotor position estimation module
 *
 * @param[in] pParameters - Pointer to parameters structure
 *
 * @return None
 */
void  mcRpeI_RotorPositionEstimDisable( tmcRpe_Parameters_s * const pParameters )
{
    /** Get the linked state variable */
    tmcRpe_State_s * pState;
    pState = (tmcRpe_State_s *)pParameters->pStatePointer;

    if( NULL != pState)
    {
        /** Reset state variables  */
        mcRpeI_RotorPositionEstimReset(pParameters);
    }
    else
    {
        /** For MISRA Compliance */
    }

    /** Set enable flag as true */
    pState->enable = false;
}

#if defined  ENABLE_PHI_OFFSET_COMPENSATION
/*! 
 * @brief Disable rotor position estimation module
 *
 * @details
 * Rotor position offset calculation
 *
 * @param[in] pParameters - Pointer to parameters structure
 * @param[in/out] pS16Offset - Pointer to offset values
 *
 * @return None
 */
__STATIC_INLINE  void mcRpe_RotorPostionOffsetCalc( const tmcRpe_Parameters_s * const pParameters, 
                                                    float32_t * const pF32Offset ) 
{
    /** Get the linked state variable */
    tmcRpe_State_s * pState;
    pState = (tmcRpe_State_s *)pParameters->pStatePointer;

    pState->calibCounter++;

    if( pState->calibCounter > pState->calibTimeinCounts ){
        return;
    }

    /** Integrator drift  tracking and compensation based on speed direction */
    if( 0 < pState->n )     {
        if( UTIL_AbsLessThanEqual( pState->eAlpha,  0.001 ))
        {
            if( pState->eBeta > 0 )
            {
                *pF32Offset = pState->phi;
            }
        }
    }
    else      {
        if( UTIL_AbsLessThanEqual( pState->eAlpha,  0.001 ))
        {
            if( pState->eBeta < 0 ) 
            {
                *pF32Offset = pState->phi;
            }
        }
    }
}
#endif

/*! 
 * @brief Perform rotor position estimation
 *
 * @details
 * Perform rotor position estimation
 *
 * @param[in] pParameters - Pointer to parameters structure
 * @param[in] pIAlphaBeta - Pointer to input alpha-beta voltages
 * @param[in] pUAlphaBeta - Pointer to input alpha-beta currents
 * @param[out] pAngle - Pointer to store estimated rotor angle
 * @param[out] pSpeed - Pointer to store estimated rotor speed
 *
 * @return None
 */
void mcRpeI_RotorPositionEstim(  const tmcRpe_Parameters_s * const pParameters,
                                                     const tmcTypes_AlphaBeta_s * pIAlphaBeta,
                                                     const tmcTypes_AlphaBeta_s * pUAlphaBeta,
                                                     tmcTypes_AlphaBeta_s * pEAlphaBeta,
                                                     float32_t * pAngle, float32_t * pSpeed )
{
    /** Get the linked state variable */
    tmcRpe_State_s * pState;
    pState = (tmcRpe_State_s *)pParameters->pStatePointer;

    if( pState->enable )
    {
        float32_t temp = 0.0f;
        float32_t sine = 0.0f;
        float32_t cosine= 0.0f;

        /** Calculate back EMF along alpha and beta axis */
        temp = pState->uAlpha;
        temp -= ( pIAlphaBeta->alpha * pState->Rs );
        temp -= ( pIAlphaBeta->alpha - pState->iAlpha ) * pState->dLsByDt;
        LPF( temp, pState->eAlpha, pState->eABFilterParameter );

        temp  =  pState->uBeta;
        temp -= ( pIAlphaBeta->beta * pState->Rs );
        temp -= ( pIAlphaBeta->beta - pState->iBeta ) * pState->dLsByDt;
        LPF( temp, pState->eBeta, pState->eABFilterParameter);

        /** Update state variables for next cycle calculation */
        pState->uAlpha  = pUAlphaBeta->alpha;
        pState->uBeta  =  pUAlphaBeta->beta;
        pState->iAlpha  =  pIAlphaBeta->alpha ;
        pState->iBeta   =  pIAlphaBeta->beta;

        /** Determine back EMF along direct and quadrature axis using estimated angle */
        mcUtils_SineCosineCalculation( pState->phi, &sine, &cosine );

        temp  =     pState->eAlpha * cosine;
        temp +=  ( pState->eBeta * sine );
        LPF( temp, pState->eD, pState->eDQFilterParameter);

        temp  =    -pState->eAlpha * sine;
        temp +=  ( pState->eBeta * cosine );
        LPF( temp, pState->eQ, pState->eDQFilterParameter);

        /** Determine speed  */
        if( pState->eQ > 0.0f ) {
            temp  = pState->oneByKe * ( pState->eQ - pState->eD );
        }
        else  {
            temp  = pState->oneByKe * ( pState->eQ + pState->eD );
        }

        LPF( temp, pState->n, pState->nFilterParameter);

        /** Determine phase angle */
        pState->phi += ( pState->speedToAngle * pState->n );
        mcUtils_TruncateAngle0To2Pi( &pState->phi );

#if defined  ENABLE_PHI_OFFSET_COMPENSATION
        mcRpe_RotorPostionOffsetCalc( pParameters, &pState->phiOffset );
#endif

        /** Update output */
        *pSpeed = pState->n;
        *pAngle = pState->phi - pState->phiOffset;
         mcUtils_TruncateAngle0To2Pi( pAngle );
    }
    else
    {
        /** Rotor position estimation */
        mcRpeI_RotorPositionEstimReset( pParameters );

        /** Update output */
        *pSpeed = 0.0f;
        *pAngle = 0.0f;
    }

    pEAlphaBeta->alpha = pState->eAlpha;
    pEAlphaBeta->beta = pState->eBeta;
}

/*! 
 * @brief Reset rotor position estimation module
 *
 * @details
 * Reset rotor position estimation module
 *
 * @param[in] pParameters - Pointer to parameters structure
 *
 * @return None
 */
void mcRpeI_RotorPositionEstimReset( const tmcRpe_Parameters_s * const pParameters )
{
    /** Get the linked state variable */
    tmcRpe_State_s * pState;
    pState = (tmcRpe_State_s *)pParameters->pStatePointer;

    /** Reset state variables  */
    pState->iAlpha = 0.0f;
    pState->iBeta = 0.0f;
    pState->uAlpha = 0.0f;
    pState->uBeta = 0.0f;
}
