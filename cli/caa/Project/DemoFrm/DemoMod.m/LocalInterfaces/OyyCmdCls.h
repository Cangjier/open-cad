//Author     : QiaoMu
//CreateTime : 2023Äê06ÔÂ17ÈÕ
#ifndef OyyCmdCls_H
#define OyyCmdCls_H

#include "CATCommand.h"

class OyyCmdCls: public CATCommand
{
  public:

  OyyCmdCls();
  virtual ~OyyCmdCls();

   virtual CATStatusChangeRC Activate(
                            CATCommand * iFromClient,
                            CATNotification * iEvtDat);

   virtual CATStatusChangeRC Desactivate(
                            CATCommand * iFromClient,
                            CATNotification * iEvtDat);

   virtual CATStatusChangeRC Cancel(
                            CATCommand * iFromClient,
                            CATNotification * iEvtDat);

};
#endif
