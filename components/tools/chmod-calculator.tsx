"use client"

import { useState, useEffect, memo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Shield } from "lucide-react"
import { toast } from "sonner"

type Permission = {
  read: boolean
  write: boolean
  execute: boolean
}

type Permissions = {
  owner: Permission
  group: Permission
  others: Permission
}

function ChmodCalculatorInner() {
  const [permissions, setPermissions] = useState<Permissions>({
    owner: { read: true, write: true, execute: true }, // 7
    group: { read: true, write: false, execute: true }, // 5
    others: { read: true, write: false, execute: true }, // 5
  })
  
  const [octal, setOctal] = useState("755")
  const [symbolic, setSymbolic] = useState("-rwxr-xr-x")

  useEffect(() => {
    calculate()
  }, [permissions])

  const calculate = () => {
    let oct = ""
    let sym = "-"

    // Owner
    const o = (permissions.owner.read ? 4 : 0) + (permissions.owner.write ? 2 : 0) + (permissions.owner.execute ? 1 : 0)
    oct += o
    sym += permissions.owner.read ? "r" : "-"
    sym += permissions.owner.write ? "w" : "-"
    sym += permissions.owner.execute ? "x" : "-"

    // Group
    const g = (permissions.group.read ? 4 : 0) + (permissions.group.write ? 2 : 0) + (permissions.group.execute ? 1 : 0)
    oct += g
    sym += permissions.group.read ? "r" : "-"
    sym += permissions.group.write ? "w" : "-"
    sym += permissions.group.execute ? "x" : "-"

    // Others
    const ot = (permissions.others.read ? 4 : 0) + (permissions.others.write ? 2 : 0) + (permissions.others.execute ? 1 : 0)
    oct += ot
    sym += permissions.others.read ? "r" : "-"
    sym += permissions.others.write ? "w" : "-"
    sym += permissions.others.execute ? "x" : "-"

    setOctal(oct)
    setSymbolic(sym)
  }

  const togglePermission = (role: keyof Permissions, type: keyof Permission) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [type]: !prev[role][type]
      }
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("已复制到剪贴板")
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <PermissionGroup 
            title="Owner (所有者)" 
            role="owner"
            values={permissions.owner}
            onChange={togglePermission}
          />
          <PermissionGroup 
            title="Group (用户组)" 
            role="group"
            values={permissions.group}
            onChange={togglePermission}
          />
          <PermissionGroup 
            title="Others (其他人)" 
            role="others"
            values={permissions.others}
            onChange={togglePermission}
          />
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-lg border bg-accent/10 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              结果
            </h3>
            
            <div className="space-y-2">
              <Label>Octal (八进制)</Label>
              <div className="flex gap-2">
                <Input value={octal} readOnly className="font-mono text-lg" />
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(octal)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => copyToClipboard(`chmod ${octal} filename`)}>
                  复制 chmod {octal} ...
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => copyToClipboard(`chmod -R ${octal} directory`)}>
                  复制 chmod -R {octal} ...
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Symbolic (符号)</Label>
              <div className="flex gap-2">
                <Input value={symbolic} readOnly className="font-mono text-lg" />
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(symbolic)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-medium text-foreground">常见权限:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer" 
                   onClick={() => {
                     setPermissions({
                       owner: { read: true, write: true, execute: true },
                       group: { read: true, write: false, execute: true },
                       others: { read: true, write: false, execute: true },
                     })
                   }}>
                <span>755 (Web Server)</span>
                <span className="font-mono text-xs">rwxr-xr-x</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                   onClick={() => {
                    setPermissions({
                      owner: { read: true, write: true, execute: false },
                      group: { read: true, write: false, execute: false },
                      others: { read: true, write: false, execute: false },
                    })
                  }}>
                <span>644 (File)</span>
                <span className="font-mono text-xs">rw-r--r--</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                   onClick={() => {
                    setPermissions({
                      owner: { read: true, write: true, execute: true },
                      group: { read: false, write: false, execute: false },
                      others: { read: false, write: false, execute: false },
                    })
                  }}>
                <span>700 (Private)</span>
                <span className="font-mono text-xs">rwx------</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ChmodCalculator = memo(ChmodCalculatorInner)

function PermissionGroup({ title, role, values, onChange }: { 
  title: string, 
  role: keyof Permissions, 
  values: Permission, 
  onChange: (role: keyof Permissions, type: keyof Permission) => void 
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={values.read} onCheckedChange={() => onChange(role, 'read')} />
          <span>Read (4)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={values.write} onCheckedChange={() => onChange(role, 'write')} />
          <span>Write (2)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={values.execute} onCheckedChange={() => onChange(role, 'execute')} />
          <span>Execute (1)</span>
        </label>
      </div>
    </div>
  )
}
